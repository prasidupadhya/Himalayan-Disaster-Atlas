import { expect, test } from '@playwright/test';
import { deliveryFixture } from '../helpers/live-publication';
for(const state of ['normal','stale','empty','failed','unavailable'] as const)test(`air quality remains off during ${state} feed delivery`,async({page})=>{
  const f=deliveryFixture(state);await page.clock.install({time:new Date(state==='stale'?'2026-10-06T18:00:00Z':'2026-10-06T12:01:00Z')});
  await page.route('**/live/latest.json',route=>route.fulfill({json:f.index}));await page.route('**/data/live-usgs/1.0.1/snapshot.json',route=>route.fulfill({body:f.raw}));
  const aq:string[]=[];page.on('request',request=>{if(/openaq|live-air-quality|live-openaq/.test(request.url()))aq.push(request.url());});
  await page.goto('/data-catalog/#live-delivery');await page.getByRole('button',{name:'Check published feeds',exact:true}).click();
  await expect(page.getByRole('region',{name:'Air quality availability'})).toContainText('OFF in the public build');await expect(page.getByRole('region',{name:'Air quality availability'})).toContainText('AQI: UNKNOWN');expect(aq).toEqual([]);
});
test('a forged OpenAQ enablement or corrupt feed cannot bypass the public guard',async({page})=>{
  const f=deliveryFixture();f.index.feeds[1].feed_id='openaq';f.index.feeds[1].enabled=true;f.index.feeds[1].attempt_status='failed';f.index.feeds[1].last_attempt_at=f.index.generated_at;f.index.feeds[1].error_code='network_error';f.index.workflow.status='partial';f.index.workflow.last_attempt_at=f.index.generated_at;
  await page.route('**/live/latest.json',route=>route.fulfill({json:f.index}));await page.goto('/data-catalog/#live-delivery');await page.getByRole('button',{name:'Check published feeds',exact:true}).click();
  await expect(page.getByRole('region',{name:'Live feed delivery',exact:true})).toContainText('disabled pending review');await expect(page.getByRole('region',{name:'Air quality availability'})).toContainText('AQI: UNKNOWN');
  await page.route('**/live/latest.json',route=>route.fulfill({body:'{}'}));await page.getByRole('button',{name:'Check published feeds',exact:true}).click();await expect(page.getByRole('region',{name:'Live feed delivery',exact:true})).toContainText('Invalid live index');
});
test('air quality policy is accessible on mobile, by keyboard and without WebGL',async({page})=>{
  await page.setViewportSize({width:320,height:844});await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,kind:string,...args:unknown[]){return /webgl/i.test(kind)?null:original.call(this,kind as '2d',...args);} as typeof original;});
  await page.goto('/data-catalog/#live-delivery');const button=page.getByRole('button',{name:'Check published feeds',exact:true});for(let i=0;i<220 && !(await button.evaluate(e=>e===document.activeElement));i++)await page.keyboard.press('Tab');await expect(button).toBeFocused();await page.keyboard.press('Enter');
  await expect(page.getByRole('region',{name:'Air quality availability'})).toContainText('provider licence review required');expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
});
