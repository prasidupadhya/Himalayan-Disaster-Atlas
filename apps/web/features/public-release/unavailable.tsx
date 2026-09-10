'use client';
// Public builds replace dependent entry points before webpack traverses their imports.
// The research build continues to use the original components and source artifacts.
function Unavailable() {
  return <div className="public-unavailable" role="status"><p className="eyebrow">Public release boundary</p><h2>Research data is not republished here.</h2><p>This feature is unavailable in this public release because its source data or derived index is pending redistribution review. Missing results are UNKNOWN, not zero. <a href="/licenses/">See release availability and source terms</a>.</p></div>;
}
export function EventPages() { return <article className="page unavailable-page"><p className="eyebrow">Historical events / evidence pages</p><h1>Historical event pages</h1><Unavailable /></article>; }
export function EvidenceBrowser() { return <Unavailable />; }
export function Analyst() { return <Unavailable />; }
function OmittedControl() { return null; }
export { OmittedControl as Hydrology, OmittedControl as Rainfall, OmittedControl as DisasterEvents, OmittedControl as Floods, OmittedControl as Landslides, OmittedControl as Population, OmittedControl as ExposureEngine, OmittedControl as HazardGraph, OmittedControl as TimeMachine, OmittedControl as Search, OmittedControl as CompareMode, OmittedControl as LocationExplorer };
