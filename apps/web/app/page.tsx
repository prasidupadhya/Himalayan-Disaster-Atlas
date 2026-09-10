import Link from 'next/link';
export default function Home() {
  return <div className="home">
    <section className="home-hero page" aria-labelledby="home-title">
      <div className="home-copy">
        <p className="eyebrow">Nepal / evidence / exploration</p>
        <h1 id="home-title">Himalayan<br />Disaster Atlas</h1>
        <p className="intro">An interactive geospatial atlas connecting Nepal’s mountains, water, hazards, infrastructure and communities — with evidence kept visible at every step.</p>
        <div className="home-actions"><Link className="primary-action" href="/atlas/">Explore Nepal <span aria-hidden="true">→</span></Link><Link className="text-action" href="/methodology/">Read the methodology</Link></div>
        <dl className="home-stats" aria-label="Administrative coverage">
          <div><dt>7</dt><dd>Provinces</dd></div><div><dt>77</dt><dd>Districts</dd></div><div><dt>753</dt><dd>Local governments</dd></div>
        </dl>
      </div>
      <aside className="home-terrain" aria-label="Terrain workspace preview">
        <div className="terrain-plate" aria-hidden="true">
          <svg viewBox="0 0 720 460" preserveAspectRatio="xMidYMid slice">
            <path className="terrain-ridge terrain-ridge-back" d="M-30 335 90 262 160 287 244 173 300 232 390 102 468 216 528 168 610 255 760 206V500H-30Z" />
            <path className="terrain-ridge terrain-ridge-mid" d="M-20 378 105 313 170 334 252 244 330 312 419 189 487 270 566 222 645 308 760 271V500H-20Z" />
            <path className="terrain-ridge terrain-ridge-front" d="M-20 414 108 354 202 388 294 305 365 355 448 276 530 343 603 294 684 361 760 335V500H-20Z" />
            <path className="terrain-contour" d="M21 381c103-50 145-27 232-84 77-50 94-126 179-113 62 9 80 72 143 68 48-3 78-36 128-49" />
            <path className="terrain-contour" d="M36 413c108-43 166-13 249-66 71-45 93-102 170-94 75 8 92 68 154 68 42 0 70-24 108-37" />
          </svg>
          <span className="terrain-coordinate terrain-coordinate-nw">26°–31° N</span><span className="terrain-coordinate terrain-coordinate-se">80°–89° E</span>
        </div>
        <div className="terrain-teaser-copy"><p className="eyebrow">Terrain workspace</p><h2>Read the landscape in context.</h2><p>Verified Copernicus GLO-90 terrain supports the Atlas display and 3D perspective. The illustration above is an interface motif, not a measured terrain profile.</p><Link href="/atlas/#atlas-map">Open the terrain view</Link></div>
      </aside>
    </section>
    <section className="home-loop" aria-labelledby="loop-title"><div className="page">
      <p className="eyebrow">The research loop</p><h2 id="loop-title">From observation to evidence-aware exploration.</h2>
      <ol><li><span>01</span>Observe</li><li><span>02</span>Understand</li><li><span>03</span>Trace hazards</li><li><span>04</span>See exposure</li><li><span>05</span>Look through time</li><li><span>06</span>Run labelled scenarios</li><li><span>07</span>Show the evidence</li></ol>
    </div></section>
    <section className="home-foundation page"><div><p className="eyebrow">Administrative foundation</p><h2>Geography with stable identity.</h2></div><div><p>Explore Nepal’s provinces, districts, 753 local-government units, and 22 protected or special-area pieces from the public COD-AB v02 release. Each record carries a stable P-code and traceable source metadata.</p><Link href="/methodology/#administrative-method">How the boundaries were prepared</Link></div></section>
  </div>;
}
