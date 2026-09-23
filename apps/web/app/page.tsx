import Link from 'next/link';
import { NepalOverview } from '../components/nepal-overview';
import { isPublicRelease } from '../lib/public-release';
export default function Home() {
  return <div className="home">
    <section className="home-hero page" aria-labelledby="home-title">
      <div className="home-copy">
        <p className="eyebrow">Nepal / evidence / exploration</p>
        <h1 id="home-title"><span>Himalayan</span><span>Disaster Atlas</span></h1>
        <p className="intro">Explore Nepal’s mountains, water and communities. Follow the geography, inspect the sources, and keep uncertainty in view.</p>
        <div className="home-actions"><Link className="primary-action" href="/atlas/">Explore Nepal <span aria-hidden="true">→</span></Link><Link className="text-action" href="/methodology/">Read the methodology</Link></div>
      </div>
      <NepalOverview />
    </section>
    <section className="home-coverage page" aria-label="Administrative coverage">
      <div><h2>One landscape.<br />{' '}A shared geographic foundation.</h2><p>Stable identifiers connect the map to its source records.</p></div>
      <dl className="home-stats"><div><dt>7</dt><dd>Provinces</dd></div><div><dt>77</dt><dd>Districts</dd></div><div><dt>753</dt><dd>Local governments</dd></div></dl>
    </section>
    <section className="home-pathways page" aria-labelledby="pathways-title">
      <h2 id="pathways-title">Choose a starting point.</h2>
      <div className="pathway-layout">
        <Link className="pathway-primary" href="/atlas/#atlas-map"><span className="pathway-label">Explore the landscape</span><h3>From the mountains<br />to the river network.</h3><p>Find glacial lakes, follow downstream rivers, and explore nearby infrastructure. Source records stay within reach.</p><span className="pathway-destination">Open the map <span aria-hidden="true">↗</span></span></Link>
        <div className="pathway-secondary">
          <Link href="/data-catalog/"><h3>Know what powers the map.</h3><p>Find versioned releases, processing history, coverage and download links.</p><span className="pathway-destination">Browse the data catalog <span aria-hidden="true">↗</span></span></Link>
          <Link href="/methodology/"><h3>Read the method, then the result.</h3><p>Understand how observations, derived data and hypothetical scenarios differ.</p><span className="pathway-destination">Read the methodology <span aria-hidden="true">↗</span></span></Link>
        </div>
      </div>
    </section>
    <section className="home-foundation page" aria-labelledby="foundation-title"><h2 id="foundation-title">Evidence stays in the picture.</h2><p>Explore Nepal’s provinces, districts, 753 local-government units, and 22 protected or special-area pieces from the public COD-AB v02 release. Each record carries a stable P-code and traceable source metadata.</p><p className="muted">{isPublicRelease ? 'This public edition includes reviewed datasets. Some records and dependent research tools are withheld pending redistribution review.' : 'Research tools preserve their source dates, limitations and assumptions. Modelled results are hypothetical, not forecasts.'} Missing measurements remain UNKNOWN.</p><Link href="/licenses/">Availability, licences & attribution <span aria-hidden="true">→</span></Link></section>
  </div>;
}
