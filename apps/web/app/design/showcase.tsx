'use client';
import { useState } from 'react';
import { Badge, Button, Card, DataTable, Disclosure, EmptyState, ErrorState, Icon, IconButton, Legend, Notice, ProgressSteps, Scrubber, Segmented, Sheet, Skeleton, Stat, Stats, TabPanel, Tabs, useToast, type Snap } from '../../components/ui';

// The token names documented in docs/redefine/design-system.md, shown as live swatches in the current theme.
const COLOURS = ['--bg', '--surface', '--surface-2', '--surface-3', '--ink', '--ink-2', '--ink-3', '--line', '--line-2', '--accent', '--accent-ink', '--accent-soft', '--focus',
  '--stage', '--stage-2', '--on-stage', '--hz-flood', '--hz-glof', '--hz-quake', '--danger', '--warning', '--normal', '--none', '--model'];

/** A living reference for the design system: every primitive in both themes. Not linked from the site and not part of
 * the offline shell; its copy is English only because it documents the code, not the atlas. */
export function Showcase() {
  const [tab, setTab] = useState<'one' | 'two'>('one');
  const [view, setView] = useState<'2d' | '3d'>('3d');
  const [snap, setSnap] = useState<Snap>('peek');
  const [time, setTime] = useState(30);
  const [toast, show] = useToast();
  return <div className="page design-page">
    <div className="page-head"><p className="eyebrow">Design system</p><h1>Atlas primitives</h1><p className="intro">Tokens, components and states, rendered with the live stylesheet. Switch the theme in the top bar to see the dark variant.</p></div>

    <section className="stack"><h2>Colour roles</h2>
      <ul className="design-swatches">{COLOURS.map(name => <li key={name}><span style={{ background: `var(${name})` }} /><code>{name}</code></li>)}</ul>
    </section>

    <section className="stack"><h2>Type</h2>
      <p style={{ font: '650 var(--step-5)/1.04 var(--font-display)', fontStretch: '116%' }}>Himalayan Disaster Atlas</p>
      <h2>Section heading</h2><h3>Card heading</h3><p>Body text in the device’s own font, 16 px on a 1.6 leading. नेपाली पाठ उही आकारमा।</p><p className="muted">Muted note text.</p>
    </section>

    <section className="stack"><h2>Actions</h2>
      <div className="cluster"><Button variant="primary">Primary action</Button><Button>Secondary</Button><Button variant="quiet">Quiet</Button><Button disabled>Disabled</Button>
        <IconButton label="Zoom in"><Icon><path d="M12 5v14M5 12h14" /></Icon></IconButton>
        <Button onClick={() => show('Link copied')}>Show a toast</Button></div>
      <div className="cluster"><Segmented label="View" value={view} onChange={setView} options={[{ value: '2d', label: '2D' }, { value: '3d', label: '3D' }]} /></div>
      <Tabs label="Example tabs" idPrefix="design" value={tab} onChange={setTab} items={[{ value: 'one', label: 'Floods', hue: 'var(--hz-flood)' }, { value: 'two', label: 'Earthquakes', hue: 'var(--hz-quake)' }]} />
      <TabPanel idPrefix="design" value="one" selected={tab === 'one'}><p>First panel.</p></TabPanel>
      <TabPanel idPrefix="design" value="two" selected={tab === 'two'}><p>Second panel.</p></TabPanel>
      <ProgressSteps label="Scenario steps" current={1} steps={['Choose', 'Set inputs', 'Watch and read']} />
      <Scrubber label="Time after release" min={0} max={120} value={time} valueText={`${time} min`} start="0 min" end="2 h" onChange={setTime} />
    </section>

    <section className="stack"><h2>Status and notices</h2>
      <div className="cluster"><Badge tone="danger">Above danger</Badge><Badge tone="warning">Above warning</Badge><Badge tone="normal">Below warning</Badge><Badge tone="none">No reading</Badge><Badge tone="model">Modelled</Badge><Badge tone="info">Official copy</Badge></div>
      <Notice tone="model" glyph="◇"><strong>Scenario / educational estimate, not a forecast or warning.</strong> Official warnings come from DHM and NDRRMA.</Notice>
      <Notice tone="warning" glyph="↺"><strong>LAST KNOWN</strong> copy saved on this device. Not rechecked.</Notice>
      <ErrorState title="The dataset could not be validated." retry={() => undefined} retryLabel="Try again"><p>Checksum failed.</p></ErrorState>
      <EmptyState title="No incidents in this copy.">Nothing was recorded in the last 7 days.</EmptyState>
      <Skeleton height="4rem" />
    </section>

    <section className="stack"><h2>Content</h2>
      <Stats label="Example figures"><Stat label="Rivers above warning" value="2" sub="177 stations reported in 24 h" /><Stat label="Latest earthquake" value="4.1 ML" sub="Bajura, 2026-10-07" /><Stat label="Rain above warning" value="UNKNOWN" /></Stats>
      <div className="design-cards"><Card><h3>Card</h3><p>Raised content group.</p></Card><Card quiet><h3>Quiet card</h3><p>Sunken group.</p></Card></div>
      <DataTable caption="Example table (cards on phones)" head={['Station', 'Status', 'Level']} rows={[{ key: 'a', cells: ['Chisapani', 'below warning', '4.2 m'] }, { key: 'b', cells: ['Kusum', 'UNKNOWN', 'UNKNOWN'] }]} />
      <Disclosure summary="Method, inputs and limitations"><p>Disclosure body.</p></Disclosure>
      <Legend label="Map key" entries={[{ key: 'r', shape: 'line', colour: '#3987e5', label: 'River reach' }, { key: 'l', shape: 'dot', colour: '#199e70', label: 'Glacial lake' }, { key: 'b', shape: 'area', colour: '#7f9aa6', label: 'Boundary' }]} />
    </section>

    <section className="stack"><h2>Sheet</h2>
      <p className="muted">A side panel on wide screens; on phones a bottom sheet with three heights. Drag or tap the handle, or use the arrow keys on it.</p>
      <div className="design-stage"><div className="design-stage-map" aria-hidden="true" />
        <Sheet label="Example sheet" snap={snap} onSnap={setSnap} labels={{ expand: 'Expand panel', collapse: 'Collapse panel' }} header={<h3 className="design-sheet-title">Panel title</h3>}>
          <p>Sheet content scrolls inside the sheet.</p>{Array.from({ length: 12 }, (_, i) => <p key={i}>Row {i + 1}</p>)}
        </Sheet>
      </div>
    </section>
    {toast}
  </div>;
}
