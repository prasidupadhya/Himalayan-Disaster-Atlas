import overview from '../generated/nepal-overview.json';
/** Actual reviewed display geometry, prepared and verified by the root build. */
export function NepalOverview() {
  return <figure className="nepal-overview">
    <div className="overview-heading"><span>Nepal</span><span>Administrative geography</span></div>
    <svg viewBox="0 0 900 500" role="img" aria-labelledby="overview-title overview-description">
      <title id="overview-title">Nepal’s seven provinces</title>
      <desc id="overview-description">Province boundaries and source label positions from Nepal COD-AB v02, displayed in Web Mercator: {overview.provinces.map(p => p.name).join(', ')}. This overview is for orientation, not measurement or a statement on disputed boundaries.</desc>
      <g className="overview-graticule" aria-hidden="true">
        {overview.longitudeLines.map(({ value, x }) => <g key={value}><line x1={x} x2={x} y1="20" y2="460" /><text x={x} y="485">{value}° E</text></g>)}
        {overview.latitudeLines.map(({ value, y }) => <g key={value}><line x1="25" x2="875" y1={y} y2={y} /><text x="20" y={y - 7}>{value}° N</text></g>)}
      </g>
      <g className="overview-provinces">{overview.provinces.map(p => <path key={p.pcode} d={p.path} fillRule="evenodd"><title>{p.name}</title></path>)}</g>
      <g className="overview-labels">{overview.provinces.map(p => <text key={p.pcode} x={p.x} y={p.y}>{p.name}</text>)}</g>
    </svg>
    <figcaption><span>Source: Survey Department of Nepal · UN / OCHA / HDX</span><a href="/methodology/#administrative-method">COD-AB v02 · source & limitations</a></figcaption>
  </figure>;
}
