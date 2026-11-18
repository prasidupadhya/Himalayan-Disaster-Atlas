import { c, esc, when, load } from './app.js';

// The licence table is read from each published manifest, so it always matches the files served.
const DATASETS = ['nepal-admin-country/2.0.1', 'nepal-admin-provinces/2.0.1', 'nepal-admin-districts/2.0.1', 'nepal-terrain/1.0.0', 'nepal-mountains/1.0.0', 'nepal-rivers-primary/1.0.0',
  'nepal-transboundary-glacial-lakes/1.0.0', 'nepal-glaciers-west/1.0.0', 'nepal-glaciers-central/1.0.0', 'nepal-glaciers-east/1.0.0', 'nepal-hydrology-stations/1.0.0', 'nepal-region-earthquakes/1.0.0', 'nepal-osm-settlements/1.0.0', 'nepal-river-names/1.0.0',
  'nepal-hrsl-population/1.0.0', 'atlas-gmpe-bssa14/1.0.0', 'atlas-flood-corridors/1.0.0'];
const box = document.getElementById('about');
// A long document: one column, inline heads, the one action a link inside the opening paragraph.
const block = (title, paras) => `<section><h2 class="inline">${esc(title)}.</h2> ${paras.map(p => `<p>${esc(p)}</p>`).join('')}</section>`;
box.innerHTML = `<h1>${esc(c.aboutTitle)}</h1><p class="lede">${esc(c.aboutIntro)} <a href="/map/">${esc(c.exploreMap)}</a></p>
${block(c.howTitle, c.how)}${block(c.modelsTitle, c.models)}${block(c.limitsTitle, [c.limits.join(' ')])}
<section class="wide-block"><h2>${esc(c.sourcesTitle)}</h2><div id="sources"><p>${esc(c.loading)}</p></div></section>
${block(c.softwareTitle, [c.software])}<p><a href="https://github.com/prasidupadhya/Himalayan-Disaster-Atlas" rel="noopener">${esc(c.codeLink)}</a></p>`;

const rows = await Promise.all(DATASETS.map(async d => {
  try {
    const m = await load(`/data/${d}/manifest.json`), x = m.metadata ?? m;
    const link = (text, href) => href ? `<a href="${esc(href)}" rel="noopener">${esc(text)}</a>` : esc(text);
    return `<tr><td>${esc(x.dataset_name ?? x.dataset_id ?? d)}</td><td>${link(x.source, x.source_url)}<br><small>${esc(x.attribution ?? '')}</small></td><td>${link(x.license, x.license_url)}</td><td>${esc(x.dataset_version ?? d.split('/')[1])}</td><td>${x.retrieval_date ? esc(when(x.retrieval_date, { dateStyle: 'medium' })) : esc(c.unknown)}</td></tr>`;
  } catch { return `<tr><td>${esc(d)}</td><td colspan="4">${esc(c.failed)}</td></tr>`; }
}));
document.getElementById('sources').innerHTML = `<div class="scroll" tabindex="0"><table><thead><tr><th>${esc(c.dataset)}</th><th>${esc(c.source)}</th><th>${esc(c.licence)}</th><th>${esc(c.version)}</th><th>${esc(c.retrieved)}</th></tr></thead><tbody>${rows.join('')}</tbody></table></div>`;
