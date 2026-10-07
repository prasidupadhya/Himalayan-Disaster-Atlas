import { expect, test, type Page } from '@playwright/test';
import { deliveryFixture, type DeliveryCase } from '../helpers/live-publication';
async function setup(page: Page, state: DeliveryCase = 'normal') {
  const f = deliveryFixture(state);
  await page.clock.install({ time: new Date(state === 'stale' ? '2026-10-06T18:00:00Z' : '2026-10-06T12:01:00Z') });
  await page.route('**/live/latest.json', route => route.fulfill({ json: f.index }));
  await page.route('**/data/live-usgs/1.0.1/snapshot.json', route => route.fulfill({ contentType: 'application/json', body: f.raw }));
  await page.goto('/data-catalog/#live-delivery');
}
async function check(page: Page) { await page.getByRole('button', { name: 'Check published feeds', exact: true }).click(); }
const region = (page: Page) => page.getByRole('region', { name: 'usgs delivery', exact: true });
for (const [state, expected] of [['normal','ready'],['empty','empty'],['failed','stale'],['unavailable','unavailable'],['stale','stale']] as const) test(`published ${state} stays ${expected}`, async ({ page }) => {
  await setup(page,state); await check(page); await expect(region(page)).toHaveAttribute('data-feed-state',expected);
  if (state==='empty') await expect(region(page)).toContainText('not a failed fetch or an all-clear');
  if (state==='failed') await expect(region(page)).toContainText('Latest fetch failed');
  if (state==='normal') await expect(region(page)).toContainText('REPORTED');
  await expect(page.getByRole('region',{name:'Live feed delivery',exact:true})).toContainText('Damage, loss, inundation and casualties: UNKNOWN');
});
test('corrupted snapshot fails verification and retry recovers',async({page})=>{
  await setup(page); await page.route('**/data/live-usgs/1.0.1/snapshot.json',route=>route.fulfill({body:'{}'})); await check(page);
  await expect(region(page)).toHaveAttribute('data-feed-state','error'); await expect(region(page)).toContainText('checksum');
  await page.unroute('**/data/live-usgs/1.0.1/snapshot.json'); const f=deliveryFixture(); await page.route('**/data/live-usgs/1.0.1/snapshot.json',route=>route.fulfill({body:f.raw})); await check(page); await expect(region(page)).toHaveAttribute('data-feed-state','ready');
});
test('delivery remains usable without WebGL on mobile and makes no external requests',async({page})=>{
  await page.setViewportSize({width:320,height:844}); await page.addInitScript(()=>{ const original=HTMLCanvasElement.prototype.getContext; HTMLCanvasElement.prototype.getContext=function(this: HTMLCanvasElement, kind: string,...args: unknown[]) { return /webgl/i.test(kind)?null:original.call(this,kind as '2d',...args); } as typeof original; });
  const external:string[]=[];page.on('request',request=>{if(new URL(request.url()).hostname!=='127.0.0.1')external.push(request.url());});
  await setup(page);await check(page);await expect(region(page)).toHaveAttribute('data-feed-state','ready');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(321); expect(external).toEqual([]);
});
test('keyboard-only delivery check announces workflow health and source timestamps',async({page})=>{
  await setup(page); const button=page.getByRole('button',{name:'Check published feeds',exact:true});
  for(let i=0;i<220 && !(await button.evaluate(element=>element===document.activeElement));i++)await page.keyboard.press('Tab');
  await expect(button).toBeFocused();await page.keyboard.press('Enter');await expect(region(page)).toHaveAttribute('data-feed-state','ready');
  await expect(page.getByRole('region',{name:'Live feed delivery',exact:true})).toContainText('Workflow health: HEALTHY');
});
