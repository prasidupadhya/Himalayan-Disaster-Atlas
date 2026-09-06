import Link from 'next/link';
export default function Home() {
  return <div className="home page"><p className="eyebrow">Nepal / evidence / exploration</p><h1>Himalayan<br />Disaster Atlas</h1><p className="intro">An interactive geospatial atlas of Nepal’s mountains, hazards, water, and communities.</p><Link className="primary-action" href="/atlas/">Explore the sample atlas <span aria-hidden="true">↗</span></Link><section className="foundation-note"><h2>The foundation is ready to explore.</h2><p>This development preview connects a sample map to versioned data and source metadata. All sample features are synthetic. Geographic inventories, terrain, and analysis will arrive in later features.</p><Link href="/methodology/">Read the data principles →</Link></section></div>;
}
