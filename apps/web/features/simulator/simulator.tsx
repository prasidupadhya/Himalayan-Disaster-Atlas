'use client';
import { useCallback, useState } from 'react';
import { LIVE_AUTHORITIES } from '../../../../packages/contracts/live';
import { decodeScenario, encodeScenario, type FloodScenario, type Scenario } from '../../lib/flood-scenario';
import type { QuakeScenario } from '../../lib/earthquake';
import { LanguageSwitch, UI, useLanguage } from '../../lib/i18n';
import { FloodPanel } from './flood-panel';
import { QuakePanel } from './quake-panel';
import { simCopy } from './copy';
import { SimulatorMap, type MapScene } from './simulator-map';

type Tab = 'flood' | 'earthquake';
function initialScenario(): Scenario | null {
  try { const value = new URLSearchParams(window.location.search).get('s'); return value ? decodeScenario(value) : null; } catch { return null; }
}

export function Simulator() {
  const [lang, setLang] = useLanguage();
  const t = UI[lang], c = simCopy(lang);
  const [initial] = useState(initialScenario);
  const [tab, setTab] = useState<Tab>(() => initial?.kind === 'earthquake' || (!initial && new URLSearchParams(window.location.search).get('tab') === 'earthquake') ? 'earthquake' : 'flood');
  const [floodScene, setFloodScene] = useState<MapScene>({});
  const [quakeScene, setQuakeScene] = useState<MapScene>({});
  const [shared, setShared] = useState<Scenario | null>(null);
  const [copied, setCopied] = useState(false);
  const [pick, setPick] = useState<{ lon: number; lat: number; n: number } | null>(null);
  const [originPick, setOriginPick] = useState<{ id: string; n: number } | null>(null);
  const [floodSlot, setFloodSlot] = useState<HTMLElement | null>(null);
  const [quakeSlot, setQuakeSlot] = useState<HTMLElement | null>(null);

  const share = useCallback((scenario: Scenario) => {
    setShared(scenario); setCopied(false);
    try { const url = new URL(window.location.href); url.searchParams.set('s', encodeScenario(scenario)); window.history.replaceState(null, '', url); } catch { /* sharing is optional */ }
  }, []);
  const onFloodScene = useCallback((scene: MapScene) => setFloodScene(scene), []);
  const onQuakeScene = useCallback((scene: MapScene) => setQuakeScene(scene), []);
  const link = shared ? `${typeof window === 'undefined' ? '' : window.location.origin}/simulate/?s=${encodeScenario(shared)}` : '';
  const download = () => {
    if (!shared) return;
    const blob = new Blob([JSON.stringify({ ...shared, notice: 'Scenario / educational estimate, not a forecast or warning' }, null, 2) + '\n'], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `atlas-scenario-${shared.kind}.json`; a.click(); URL.revokeObjectURL(a.href);
  };

  return <div className="sim-page" lang={lang}>
    <header className="sim-hero">
      <div className="sim-hero-top"><p className="eyebrow">{c.eyebrow}</p><LanguageSwitch lang={lang} onChange={setLang} /></div>
      <h1>{t.simTitle}</h1>
      <p className="intro">{t.simIntro}</p>
      <div className="sim-notice" role="note"><span aria-hidden="true">◇</span><div><strong>{t.scenarioNotice}.</strong> {t.authoritiesLead} {LIVE_AUTHORITIES.map((a, i) => <span key={a.name}>{i > 0 && ' · '}<a href={a.url} rel="noopener">{a.name}</a></span>)}.</div></div>
    </header>
    <div className="sim-tabs" role="tablist" aria-label={c.tablist}>
      {(['flood', 'earthquake'] as const).map(kind => <button key={kind} type="button" role="tab" id={`tab-${kind}`} aria-controls={`panel-${kind}`} aria-selected={tab === kind} tabIndex={tab === kind ? 0 : -1}
        onClick={() => setTab(kind)} onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { const next = kind === 'flood' ? 'earthquake' : 'flood'; setTab(next); document.getElementById(`tab-${next}`)?.focus(); } }}>
        <span aria-hidden="true">{kind === 'flood' ? '≈' : '◎'}</span> {kind === 'flood' ? t.tabFlood : t.tabQuake}
      </button>)}
    </div>
    <div className="sim-layout">
      <div className="sim-controls">
        <div role="tabpanel" id="panel-flood" aria-labelledby="tab-flood" hidden={tab !== 'flood'}>
          <FloodPanel lang={lang} initial={initial?.kind === 'flood' ? initial as FloodScenario : null} onScene={onFloodScene} onShare={share} pick={originPick} slot={floodSlot} />
        </div>
        <div role="tabpanel" id="panel-earthquake" aria-labelledby="tab-earthquake" hidden={tab !== 'earthquake'}>
          <QuakePanel lang={lang} initial={initial?.kind === 'earthquake' ? initial as QuakeScenario : null} onScene={onQuakeScene} onShare={share} pick={pick} slot={quakeSlot} />
        </div>
      </div>
      <aside className="sim-map-column" aria-label={c.mapRegion}>
        <a className="map-skip-link" href="#sim-after-map">{c.skipMap}</a>
        <SimulatorMap scene={tab === 'flood' ? floodScene : quakeScene} label={c.mapLabel} messages={{ loading: c.mapLoading, failed: c.mapFailed, noWebgl: c.mapNoWebgl }}
          onOrigin={tab === 'flood' ? id => setOriginPick(p => ({ id, n: (p?.n ?? 0) + 1 })) : undefined} onPick={tab === 'earthquake' ? (lon, lat) => setPick(p => ({ lon, lat, n: (p?.n ?? 0) + 1 })) : undefined} />
        <p className="sim-map-note">{tab === 'flood' ? c.mapNoteFlood : c.mapNoteQuake}</p>
        <span id="sim-after-map" tabIndex={-1} />
      </aside>
    </div>
    <div className="sim-results">
      <div ref={setFloodSlot} hidden={tab !== 'flood'} />
      <div ref={setQuakeSlot} hidden={tab !== 'earthquake'} />
      {shared && shared.kind === (tab === 'flood' ? 'flood' : 'earthquake') && <div className="sim-actions" aria-label={c.shareRegion}>
        <button type="button" onClick={() => { void navigator.clipboard?.writeText(link).then(() => setCopied(true), () => setCopied(false)); }}>{copied ? t.copied : t.share}</button>
        <button type="button" onClick={download}>{t.download}</button>
        <a className="sim-report-link" href={`/simulate/report/?s=${encodeScenario(shared)}`}>{t.report} →</a>
        <p className="sim-muted">{c.shareNote}</p>
      </div>}
    </div>
  </div>;
}
