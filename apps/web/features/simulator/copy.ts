import { digits, formatNumber, type Lang } from '../../lib/i18n';

/**
 * Simulator copy in English and project-authored Nepali (requires native-speaker review before operational
 * reliance). Scientific identifiers — dataset ids, HYRIV ids, model names, units and "UNKNOWN" — stay verbatim
 * in both languages so a reader can trace them to the catalogue.
 */
const n = (v: number | null, lang: Lang, f = 0) => formatNumber(v, lang, f);

/** Long duration: "1 h 09 min" / "१ घण्टा ०९ मिनेट". */
export function duration(seconds: number, lang: Lang) {
  if (!Number.isFinite(seconds)) return formatNumber(null, lang);
  const minutes = Math.round(seconds / 60);
  const h = Math.floor(minutes / 60), m = minutes % 60, mm = String(m).padStart(2, '0');
  if (lang === 'en') return minutes < 60 ? `${minutes} min` : h < 48 ? `${h} h ${mm} min` : `${(seconds / 86400).toFixed(1)} days`;
  return minutes < 60 ? `${digits(String(minutes), lang)} मिनेट` : h < 48 ? `${digits(String(h), lang)} घण्टा ${digits(mm, lang)} मिनेट` : `${digits((seconds / 86400).toFixed(1), lang)} दिन`;
}
/** Compact table duration: "1h09" / "१:०९". */
export function shortTime(seconds: number, lang: Lang) {
  if (!Number.isFinite(seconds)) return formatNumber(null, lang);
  const minutes = Math.round(seconds / 60);
  const h = Math.floor(minutes / 60), mm = String(minutes % 60).padStart(2, '0');
  if (lang === 'en') return minutes < 60 ? `${minutes}m` : h < 48 ? `${h}h${mm}` : `${Math.floor(h / 24)}d ${String(h % 24).padStart(2, '0')}h`;
  return minutes < 60 ? `${digits(String(minutes), lang)} मि` : h < 48 ? `${digits(`${h}:${mm}`, lang)}` : `${digits(String(Math.floor(h / 24)), lang)} दिन ${digits(String(h % 24).padStart(2, '0'), lang)} घ`;
}

export const COPY = {
  en: {
    eyebrow: 'Simulate · educational scenarios', tablist: 'Scenario type', mapRegion: 'Scenario map', skipMap: 'Skip map',
    mapLabel: 'Scenario map. Every result is also listed in the tables.',
    mapNoteFlood: 'Shaded bands: 250 / 500 / 1,000 m corridors (sensitivity variants, not flood extents). Dashed line: source river path. Click a point to select it.',
    mapNoteQuake: 'Colours: median PGA band (legend in results), computed only on Nepal population cells — no shading outside Nepal. Click the map to move a custom epicentre.',
    mapLoading: 'Loading map…', mapFailed: 'The interactive map could not render. All results remain in the tables.',
    mapNoWebgl: 'Interactive mapping is unavailable in this browser (WebGL could not start). All results remain in the tables.',
    shareRegion: 'Share this scenario', shareNote: 'The link contains only the scenario parameters; nothing is stored on a server.',
    modelled: '◇ MODELLED · HYPOTHETICAL',
    // flood
    releasePoint: 'Release point', onlyVerified: (count: number) => `Only these ${count} verified release points have pre-computed exposure. Other reaches can be explored as network paths in the`,
    workbench: 'research workbench', exposureUnknown: 'where exposure stays UNKNOWN.',
    type: 'Type', glofType: 'Glacial lake (GLOF release point)', riverType: 'River entry point', lake: 'Lake', mappedExtent: 'Mapped extent', extentNote: '(GLO 2017–2024 maximum)',
    lakeName: 'Lake name', unknownInSource: 'UNKNOWN in source', riverPath: 'River path', reaches: 'reaches',
    stopsAtEdge: (next: string) => `stops at the mapped network edge (next reach ${next} unavailable)`, reachesOutlet: 'reaches a source outlet',
    namedPoint: 'Nearest named stream point', orientationOnly: 'orientation only',
    glofOption: (id: string, basin: string, area: string) => `Glacial lake ${id} · ${basin} basin · ${area} km²`,
    riverOption: (reach: string, near: string | null) => `River entering the mapped network at HYRIV ${reach}${near ? ` (near ${near})` : ''}`,
    shape: 'Release hydrograph shape', triangular: 'Triangular (rise to a peak, then fall)', rectangular: 'Rectangular (constant outflow)',
    volume: 'Hypothetical release volume', volumeHint: 'Example value; the real lake volume is UNKNOWN (no bathymetry).',
    durationLabel: 'Release duration', hours: 'hours', durationHint: '10 minutes to 48 hours.', timeToPeak: 'Time to peak', ofDuration: '% of duration', peakHint: '5–95%.',
    celerity: 'Assumed wave celerity ensemble (m/s) — declared, not measured', minimum: 'Minimum (slowest)', central: 'Central', maximum: 'Maximum (fastest)',
    floodAssumptions: (a: { reach: string; glof: boolean; link: string; shape: string; volume: string; duration: string; peak: string; celerities: string; widths: string }) => [
      `The release starts at HYRIV ${a.reach}${a.glof ? `, the nearest mapped reach to the lake centroid (${a.link} m away); the real outlet and breach are UNKNOWN` : ', where the main stem enters the mapped network'}.`,
      `The ${a.shape} hydrograph releases exactly ${a.volume} m³ over ${a.duration} (peak ${a.peak} m³/s at the source). It is translated downstream unchanged — no attenuation, storage, tributary inflow or routing.`,
      `Arrival times use the declared celerities ${a.celerities} m/s. The range is sensitivity to that declared ensemble, not a probability.`,
      `Exposure counts use pre-computed corridors of ${a.widths} m each side of the river path. They are areas of interest, not flood extents; ranges are corridor-width sensitivity, not confidence intervals.`,
      'Population is HRSL v1.5 (modelled); assets are mapped OSM records. Outside Nepal, population is UNKNOWN.',
    ],
    frontReaches: (km: string) => `Front reaches ${km} km`, frontEnd: (km: string) => `Front reaches path end (${km} km)`,
    popCorridors: 'Population in corridors (full path)', knownSubtotal: (km2: string) => `known subtotal; up to ${km2} km² UNKNOWN`, assetsFull: 'Mapped assets (full path)',
    hydroTitle: (v: string) => `Release hydrograph at the source (not routed) · ${v} m³`,
    volumeCheck: 'Volume check: the hydrograph integrates to exactly the declared volume. Because the signal is only translated, the same shape passes every checkpoint later — real floods attenuate, so downstream peaks here are not physical predictions.',
    chartSummary: (peak: string, at: string, end: string) => [`Peak `, `${peak} m³/s`, ` at ${at} · release ends at ${end}`] as const,
    chartAria: (title: string, peak: string, d: string) => `${title}. Peak ${peak} cubic metres per second; duration ${d}.`,
    tableRegion: 'Arrival and exposure by distance',
    tableCaption: (c: string, cs: string, ws: string) => `Arrival and potential exposure by distance along the path. Bold: central value (celerity ${c} m/s; 500 m corridor). Below: range across celerities ${cs} m/s and corridors ${ws} m — sensitivity, not confidence intervals.`,
    categoriesSummary: 'Asset categories at the full path (counts overlap; do not add)',
    categoriesNote: 'Buildings and dams have no included inventory: UNKNOWN. Zero mapped assets is not evidence that none exist.',
    categories: { road: 'Major road ways', bridge: 'Bridges', school: 'Schools', health: 'Health facilities', emergency: 'Emergency facilities', settlement: 'Settlement points', hydropower: 'Hydropower' } as Record<string, string>,
    inputs: 'Inputs', parents: (k: number) => `${k} pinned parent releases`, method: 'method', methodology: 'methodology', catalog: 'data catalog',
    // earthquake
    chooseQuake: 'Choose an earthquake', replay: 'Replay a catalogued event (USGS ComCat) or set your own', custom: 'Custom epicentre (click the map or enter coordinates)',
    longitude: 'Longitude', latitude: 'Latitude', magnitude: 'Moment magnitude',
    presetNote: (id: string, type: string | null, time: string, depth: number | null) => `Catalogue record ${id}: ${type ?? 'magnitude type UNKNOWN'}, origin time ${time}, depth ${depth ?? 'UNKNOWN'} km. Epicentre only — the catalogue does not supply the rupture surface or faulting mechanism.`,
    mechanism: 'Faulting mechanism', mechanisms: { unspecified: 'Unspecified (catalogue does not state it)', reverse: 'Reverse / thrust', 'strike-slip': 'Strike-slip', normal: 'Normal (M ≤ 7)' } as Record<string, string>,
    site: 'Site condition, uniform', vs30: { 760: '760 — reference rock (B/C boundary)', 360: '360 — stiff soil', 270: '270 — stiff to soft soil', 180: '180 — soft soil' } as Record<number, string>,
    rupture: 'Rupture representation', point: 'Point at the epicentre', line: 'Declared surface line centred on the epicentre',
    length: 'Rupture length', lengthHint: 'Example value — your declaration, not from the catalogue.', strike: 'Strike', fromNorth: '° from north',
    quakeAssumptions: (point: boolean, vs30: number) => [
      'Ground motion uses BSSA14 (Boore et al. 2014, NGA-West2) global coefficients: peak ground acceleration median and ±1 total standard deviation. Valid for M 3–8.5 (normal M ≤ 7) and 0–400 km; population beyond 400 km is not assigned a band.',
      `Distance is Joyner–Boore distance to ${point ? 'the epicentre — for large magnitudes this underestimates near-fault distances, so near-field shaking is overstated' : 'a straight surface line you declared'}.`,
      `One uniform site condition (VS30 ${vs30} m/s) applies everywhere; basin effects such as the Kathmandu Valley are not modelled.`,
      '±1σ counts shift every site together — a bounding sensitivity on single-site variability, not a correlated scenario or a confidence interval.',
      'Population is HRSL v1.5 at 30″ cells; assets are mapped OSM schools, health and emergency facilities, hydropower and bridges.',
    ],
    strongPeople: 'People in cells with median PGA ≥ 0.1 g', ktm: 'Kathmandu district reference point', scenario: 'Scenario', pointSource: 'point source',
    lineSource: (l: number, s: number) => `${l} km line, strike ${s}°`, legend: 'Map legend: median PGA bands',
    bandsCaption: (beyond: string) => `Population by median PGA band, with the −1σ and +1σ bounding counts. ${beyond} people lie beyond 400 km and are not assigned a band.`,
    assetsRegion: 'Mapped assets by PGA band', assetType: 'Asset type',
    assetsCaption: 'Mapped assets by median PGA band (below: −1σ / +1σ counts). Counts are mapped OSM records, not complete inventories.',
    assetLabels: { school: 'Schools', health: 'Health facilities', emergency: 'Emergency facilities', hydropower: 'Hydropower', bridge: 'Bridges' } as Record<string, string>,
    sitesRegion: 'District reference points', sitesCaption: 'Modelled PGA at COD-AB district label points (12 highest). Points are reference locations, not district averages.',
    districtPoint: 'District point', median: 'Median PGA (g)', sigmaRange: '−1σ to +1σ (g)',
    gorkhaTitle: 'Gorkha 2015 comparison',
    gorkha1: ['The scenario replays the USGS ComCat epicentre and Mww 7.8 of event us20002926. ', 'Recorded ground motion: UNKNOWN', ' — USGS ShakeMap station records were not reachable from the build environment and are not ingested, so no model-versus-observation residual is shown. Unlock: ingest the reviewed ShakeMap station list for us20002926 (public domain) as a pinned release.'] as const,
    gorkha2: 'The catalogue supplies only the epicentre. A magnitude-7.8 rupture extends over a large fault area, so a point source can misplace the strongest shaking; declare a line rupture to explore that sensitivity. No rupture geometry is assumed for you.',
    quakeUnknownLead: 'Building damage, casualties, repair costs and economic loss:', quakeUnknown: 'UNKNOWN — no reviewed fragility, taxonomy or valuation inputs exist (gated Feature 52).',
    model: 'Model', population: 'population',
  },
  ne: {
    eyebrow: 'सिमुलेसन · शैक्षिक परिदृश्य', tablist: 'परिदृश्यको प्रकार', mapRegion: 'परिदृश्य नक्सा', skipMap: 'नक्सा छोड्नुहोस्',
    mapLabel: 'परिदृश्य नक्सा। सबै नतिजा तालिकामा पनि छन्।',
    mapNoteFlood: 'छायाँ पट्टी: २५० / ५०० / १,००० मिटर करिडोर (संवेदनशीलता विकल्प, बाढीको क्षेत्र होइन)। धर्का रेखा: स्रोत नदी मार्ग। छान्न बिन्दुमा क्लिक गर्नुहोस्।',
    mapNoteQuake: 'रङ: मध्य PGA समूह (नतिजामा सूची), नेपालका जनसंख्या कोषमा मात्र गणना — नेपालबाहिर छायाँ छैन। आफ्नै केन्द्रबिन्दु सार्न नक्सामा क्लिक गर्नुहोस्।',
    mapLoading: 'नक्सा लोड हुँदैछ…', mapFailed: 'अन्तरक्रियात्मक नक्सा देखाउन सकिएन। सबै नतिजा तालिकामा छन्।',
    mapNoWebgl: 'यस ब्राउजरमा अन्तरक्रियात्मक नक्सा उपलब्ध छैन (WebGL सुरु हुन सकेन)। सबै नतिजा तालिकामा छन्।',
    shareRegion: 'यो परिदृश्य साझा गर्नुहोस्', shareNote: 'लिङ्कमा परिदृश्यका मानहरू मात्र छन्; सर्भरमा केही पनि राखिँदैन।',
    modelled: '◇ मोडेल गरिएको · काल्पनिक',
    releasePoint: 'सुरुवात बिन्दु', onlyVerified: (count: number) => `यी ${digits(String(count), 'ne')} प्रमाणित सुरुवात बिन्दुमा मात्र पूर्व-गणना गरिएको जोखिम छ। अन्य खण्डहरू सञ्जाल मार्गका रूपमा`,
    workbench: 'अनुसन्धान कार्यस्थल', exposureUnknown: 'मा हेर्न सकिन्छ, जहाँ जोखिम अज्ञात (UNKNOWN) रहन्छ।',
    type: 'प्रकार', glofType: 'हिमताल (हिमताल विस्फोट सुरुवात बिन्दु)', riverType: 'नदी प्रवेश बिन्दु', lake: 'ताल', mappedExtent: 'नक्सांकित क्षेत्रफल', extentNote: '(GLO २०१७–२०२४ अधिकतम)',
    lakeName: 'तालको नाम', unknownInSource: 'स्रोतमा अज्ञात (UNKNOWN)', riverPath: 'नदी मार्ग', reaches: 'खण्ड',
    stopsAtEdge: (next: string) => `नक्सांकित सञ्जालको किनारमा रोकिन्छ (अर्को खण्ड ${next} उपलब्ध छैन)`, reachesOutlet: 'स्रोतको निकासमा पुग्छ',
    namedPoint: 'नजिकको नाम भएको खोला बिन्दु', orientationOnly: 'दिशाबोधका लागि मात्र',
    glofOption: (id: string, basin: string, area: string) => `हिमताल ${id} · ${basin} बेसिन · ${area} km²`,
    riverOption: (reach: string, near: string | null) => `HYRIV ${reach} मा नक्सांकित सञ्जालमा प्रवेश गर्ने नदी${near ? ` (${near} नजिक)` : ''}`,
    shape: 'सुरुवात हाइड्रोग्राफको आकार', triangular: 'त्रिकोणीय (शिखरसम्म बढ्ने, अनि घट्ने)', rectangular: 'आयताकार (स्थिर बहाव)',
    volume: 'काल्पनिक बहाव आयतन', volumeHint: 'उदाहरण मान; तालको वास्तविक आयतन अज्ञात (UNKNOWN) छ (गहिराइ मापन छैन)।',
    durationLabel: 'बहाव अवधि', hours: 'घण्टा', durationHint: '१० मिनेटदेखि ४८ घण्टा।', timeToPeak: 'शिखरसम्मको समय', ofDuration: 'अवधिको %', peakHint: '५–९५%।',
    celerity: 'मानिएको लहर गति समूह (m/s) — घोषणा गरिएको, मापन होइन', minimum: 'न्यूनतम (सबैभन्दा ढिलो)', central: 'मध्य', maximum: 'अधिकतम (सबैभन्दा छिटो)',
    floodAssumptions: (a: { reach: string; glof: boolean; link: string; shape: string; volume: string; duration: string; peak: string; celerities: string; widths: string }) => [
      `बहाव HYRIV ${a.reach} बाट सुरु हुन्छ${a.glof ? ` — तालको केन्द्रबाट सबैभन्दा नजिकको नक्सांकित खण्ड (${a.link} मिटर टाढा); वास्तविक निकास र भत्किने स्थान अज्ञात (UNKNOWN) छन्` : ' — जहाँ मूल धारा नक्सांकित सञ्जालमा प्रवेश गर्छ'}।`,
      `${a.shape === 'triangular' ? 'त्रिकोणीय' : 'आयताकार'} हाइड्रोग्राफले ${a.duration} मा ठ्याक्कै ${a.volume} m³ छोड्छ (स्रोतमा शिखर ${a.peak} m³/s)। यसलाई तलतिर नबदली सारिन्छ — कुनै क्षीणता, भण्डारण, सहायक नदीको बहाव वा राउटिङ छैन।`,
      `आइपुग्ने समय घोषणा गरिएका गति ${a.celerities} m/s मा आधारित छ। दायरा त्यो घोषित समूहप्रतिको संवेदनशीलता हो, सम्भावना होइन।`,
      `जोखिम गणना नदी मार्गको दुवैतर्फ ${a.widths} मिटरका पूर्व-गणना गरिएका करिडोरमा आधारित छ। यी चासोका क्षेत्र हुन्, बाढीको क्षेत्र होइनन्; दायरा करिडोर चौडाइको संवेदनशीलता हो, विश्वास अन्तराल होइन।`,
      'जनसंख्या HRSL v1.5 (मोडेल गरिएको) हो; संरचना नक्सांकित OSM अभिलेख हुन्। नेपालबाहिर जनसंख्या अज्ञात (UNKNOWN) छ।',
    ],
    frontReaches: (km: string) => `अग्रभाग ${km} km मा पुग्ने`, frontEnd: (km: string) => `अग्रभाग मार्गको अन्त्य (${km} km) मा पुग्ने`,
    popCorridors: 'करिडोरभित्रको जनसंख्या (पूरा मार्ग)', knownSubtotal: (km2: string) => `ज्ञात उप-जम्मा; ${km2} km² सम्म अज्ञात (UNKNOWN)`, assetsFull: 'नक्सांकित संरचना (पूरा मार्ग)',
    hydroTitle: (v: string) => `स्रोतमा सुरुवात हाइड्रोग्राफ (राउट नगरिएको) · ${v} m³`,
    volumeCheck: 'आयतन जाँच: हाइड्रोग्राफले ठ्याक्कै घोषित आयतन दिन्छ। संकेत केवल सारिने भएकाले उही आकार पछि हरेक जाँच बिन्दुबाट पार हुन्छ — वास्तविक बाढी क्षीण हुन्छ, त्यसैले यहाँका तल्लो भागका शिखर भौतिक भविष्यवाणी होइनन्।',
    chartSummary: (peak: string, at: string, end: string) => ['शिखर ', `${peak} m³/s`, ` (${at} मा) · बहाव ${end} मा सकिन्छ`] as const,
    chartAria: (title: string, peak: string, d: string) => `${title}। शिखर ${peak} घन मिटर प्रति सेकेन्ड; अवधि ${d}।`,
    tableRegion: 'दूरी अनुसार आइपुग्ने समय र जोखिम',
    tableCaption: (c: string, cs: string, ws: string) => `मार्गको दूरी अनुसार आइपुग्ने समय र सम्भावित जोखिम। गाढा: मध्य मान (गति ${c} m/s; ५०० मिटर करिडोर)। तल: गति ${cs} m/s र करिडोर ${ws} मिटरको दायरा — संवेदनशीलता, विश्वास अन्तराल होइन।`,
    categoriesSummary: 'पूरा मार्गमा संरचनाका वर्ग (गणना दोहोरिन्छ; नजोड्नुहोस्)',
    categoriesNote: 'भवन र बाँधको सूची समावेश छैन: अज्ञात (UNKNOWN)। नक्सांकित संरचना शून्य हुनु कुनै संरचना छैन भन्ने प्रमाण होइन।',
    categories: { road: 'मुख्य सडक', bridge: 'पुल', school: 'विद्यालय', health: 'स्वास्थ्य संस्था', emergency: 'आपत्कालीन सुविधा', settlement: 'बस्ती बिन्दु', hydropower: 'जलविद्युत्' } as Record<string, string>,
    inputs: 'इनपुट', parents: (k: number) => `${digits(String(k), 'ne')} पिन गरिएका मूल रिलिज`, method: 'विधि', methodology: 'विधि विवरण', catalog: 'डाटा सूची',
    chooseQuake: 'भूकम्प छान्नुहोस्', replay: 'सूचीकृत घटना (USGS ComCat) दोहोर्याउनुहोस् वा आफ्नै राख्नुहोस्', custom: 'आफ्नै केन्द्रबिन्दु (नक्सामा क्लिक गर्नुहोस् वा निर्देशांक लेख्नुहोस्)',
    longitude: 'देशान्तर', latitude: 'अक्षांश', magnitude: 'मोमेन्ट म्याग्निच्युड',
    presetNote: (id: string, type: string | null, time: string, depth: number | null) => `सूची अभिलेख ${id}: ${type ?? 'म्याग्निच्युड प्रकार अज्ञात (UNKNOWN)'}, उत्पत्ति समय ${time}, गहिराइ ${depth === null ? 'अज्ञात (UNKNOWN)' : digits(String(depth), 'ne')} km। केन्द्रबिन्दु मात्र — सूचीले फुटेको सतह वा फल्टको प्रकार दिँदैन।`,
    mechanism: 'फल्टको प्रकार', mechanisms: { unspecified: 'निर्दिष्ट छैन (सूचीमा उल्लेख छैन)', reverse: 'रिभर्स / थ्रस्ट', 'strike-slip': 'स्ट्राइक-स्लिप', normal: 'नर्मल (M ≤ ७)' } as Record<string, string>,
    site: 'स्थल अवस्था, एकरूप', vs30: { 760: '७६० — सन्दर्भ चट्टान (B/C सीमा)', 360: '३६० — कडा माटो', 270: '२७० — कडा देखि नरम माटो', 180: '१८० — नरम माटो' } as Record<number, string>,
    rupture: 'फुटाइको प्रतिनिधित्व', point: 'केन्द्रबिन्दुमा बिन्दु', line: 'केन्द्रबिन्दुमा केन्द्रित घोषित सतह रेखा',
    length: 'फुटाइको लम्बाइ', lengthHint: 'उदाहरण मान — तपाईंको घोषणा, सूचीबाट होइन।', strike: 'स्ट्राइक', fromNorth: '° उत्तरबाट',
    quakeAssumptions: (point: boolean, vs30: number) => [
      'जमिनको कम्पन BSSA14 (Boore et al. 2014, NGA-West2) विश्वव्यापी गुणाङ्कमा आधारित छ: अधिकतम जमिन प्रवेग (PGA) को मध्य मान र ±१ कुल मानक विचलन। M ३–८.५ (नर्मल M ≤ ७) र ०–४०० km का लागि मान्य; ४०० km भन्दा टाढाको जनसंख्यालाई समूह दिइँदैन।',
      `दूरी ${point ? 'केन्द्रबिन्दुसम्मको Joyner–Boore दूरी हो — ठूला भूकम्पमा यसले फल्ट नजिकको दूरी कम आँक्छ, त्यसैले नजिकको कम्पन बढी देखिन्छ' : 'तपाईंले घोषणा गरेको सीधा सतह रेखासम्मको Joyner–Boore दूरी हो'}।`,
      `एउटै स्थल अवस्था (VS30 ${digits(String(vs30), 'ne')} m/s) सबैतिर लागू हुन्छ; काठमाडौं उपत्यकाजस्ता बेसिन प्रभाव मोडेल गरिएका छैनन्।`,
      '±१σ गणनाले सबै स्थललाई सँगै सार्छ — एकल स्थल परिवर्तनशीलताको सीमा संवेदनशीलता, सम्बद्ध परिदृश्य वा विश्वास अन्तराल होइन।',
      'जनसंख्या ३०″ कोषमा HRSL v1.5 हो; संरचना नक्सांकित OSM विद्यालय, स्वास्थ्य र आपत्कालीन सुविधा, जलविद्युत् र पुल हुन्।',
    ],
    strongPeople: 'मध्य PGA ≥ ०.१ g भएका कोषमा मानिस', ktm: 'काठमाडौं जिल्ला सन्दर्भ बिन्दु', scenario: 'परिदृश्य', pointSource: 'बिन्दु स्रोत',
    lineSource: (l: number, s: number) => `${digits(String(l), 'ne')} km रेखा, स्ट्राइक ${digits(String(s), 'ne')}°`, legend: 'नक्सा सूची: मध्य PGA समूह',
    bandsCaption: (beyond: string) => `मध्य PGA समूह अनुसार जनसंख्या, −१σ र +१σ सीमा गणनासहित। ${beyond} जना ४०० km भन्दा टाढा छन् र समूहमा राखिएका छैनन्।`,
    assetsRegion: 'PGA समूह अनुसार नक्सांकित संरचना', assetType: 'संरचनाको प्रकार',
    assetsCaption: 'मध्य PGA समूह अनुसार नक्सांकित संरचना (तल: −१σ / +१σ गणना)। गणना नक्सांकित OSM अभिलेख हुन्, पूर्ण सूची होइनन्।',
    assetLabels: { school: 'विद्यालय', health: 'स्वास्थ्य संस्था', emergency: 'आपत्कालीन सुविधा', hydropower: 'जलविद्युत्', bridge: 'पुल' } as Record<string, string>,
    sitesRegion: 'जिल्ला सन्दर्भ बिन्दु', sitesCaption: 'COD-AB जिल्ला लेबल बिन्दुमा मोडेल गरिएको PGA (सबैभन्दा उच्च १२)। बिन्दुहरू सन्दर्भ स्थान हुन्, जिल्लाको औसत होइनन्।',
    districtPoint: 'जिल्ला बिन्दु', median: 'मध्य PGA (g)', sigmaRange: '−१σ देखि +१σ (g)',
    gorkhaTitle: 'गोरखा २०१५ तुलना',
    gorkha1: ['यस परिदृश्यले घटना us20002926 को USGS ComCat केन्द्रबिन्दु र Mww ७.८ दोहोर्याउँछ। ', 'अभिलेखित जमिन कम्पन: अज्ञात (UNKNOWN)', ' — USGS ShakeMap स्टेसन अभिलेख निर्माण वातावरणबाट पहुँचयोग्य थिएनन् र समावेश गरिएका छैनन्, त्यसैले मोडेल र अवलोकनबीचको फरक देखाइएको छैन। खुल्ने सर्त: us20002926 को समीक्षा गरिएको ShakeMap स्टेसन सूची (सार्वजनिक क्षेत्र) पिन गरिएको रिलिजका रूपमा समावेश गर्ने।'] as const,
    gorkha2: 'सूचीले केन्द्रबिन्दु मात्र दिन्छ। म्याग्निच्युड ७.८ को फुटाइ ठूलो फल्ट क्षेत्रमा फैलिन्छ, त्यसैले बिन्दु स्रोतले सबैभन्दा बलियो कम्पनको स्थान गलत देखाउन सक्छ; त्यो संवेदनशीलता हेर्न रेखा फुटाइ घोषणा गर्नुहोस्। तपाईंका लागि कुनै फुटाइ ज्यामिति मानिएको छैन।',
    quakeUnknownLead: 'भवन क्षति, हताहत, मर्मत लागत र आर्थिक नोक्सानी:', quakeUnknown: 'अज्ञात (UNKNOWN) — समीक्षा गरिएका कमजोरी, वर्गीकरण वा मूल्याङ्कन इनपुट छैनन् (रोकिएको सुविधा ५२)।',
    model: 'मोडेल', population: 'जनसंख्या',
  },
} as const;

export type SimCopy = (typeof COPY)['en'];
export const simCopy = (lang: Lang): SimCopy => COPY[lang] as unknown as SimCopy;
export { n as num };

/** Validation messages are produced in English by the shared libraries; this maps each one to Nepali. */
const NE_ERRORS: Array<[RegExp, (m: RegExpMatchArray) => string]> = [
  [/^Release volume must be/, () => 'बहाव आयतन १,००० देखि ५०,००,००,००० m³ हुनुपर्छ (घोषित प्रदर्शन सीमा)।'],
  [/^Release duration must be/, () => 'बहाव अवधि १० मिनेटदेखि ४८ घण्टा हुनुपर्छ।'],
  [/^Time to peak must be/, () => 'शिखरसम्मको समय अवधिको ५–९५% हुनुपर्छ।'],
  [/^Each assumed celerity/, () => 'हरेक मानिएको गति ०.१–१० m/s हुनुपर्छ।'],
  [/^Celerities must be ordered/, () => 'गति क्रममा हुनुपर्छ: न्यूनतम ≤ मध्य ≤ अधिकतम।'],
  [/^Release point is not in/, () => 'सुरुवात बिन्दु प्रमाणित करिडोर सूचीमा छैन।'],
  [/^Magnitude must be ([\d.]+)–([\d.]+)/, m => `यस फल्ट प्रकारका लागि म्याग्निच्युड ${digits(m[1], 'ne')}–${digits(m[2], 'ne')} हुनुपर्छ (BSSA14 दायरा)।`],
  [/^V_S30 must be ([\d.]+)–([\d.]+)/, m => `VS30 ${digits(m[1], 'ne')}–${digits(m[2], 'ne')} m/s हुनुपर्छ।`],
  [/^Epicentre must lie/, () => 'केन्द्रबिन्दु ७८–९०° पूर्व र २५–३२° उत्तरभित्र हुनुपर्छ।'],
  [/^Unknown mechanism/, () => 'अज्ञात फल्ट प्रकार।'],
  [/^Line rupture needs/, () => 'रेखा फुटाइका लागि १–४०० km लम्बाइ र ०–३५९° स्ट्राइक चाहिन्छ।'],
];
export function errorText(message: string, lang: Lang) {
  if (lang === 'en') return message;
  for (const [pattern, text] of NE_ERRORS) { const m = message.match(pattern); if (m) return text(m); }
  return message;
}

export const REPORT = {
  en: {
    eyebrow: 'Scenario report', quakeTitle: 'Educational earthquake shaking scenario', floodTitle: 'Educational flood / GLOF corridor scenario',
    official: 'Official forecasts and warnings:', generated: (t: string) => `Generated ${t} (viewer clock) · Himalayan Disaster Atlas · recomputed from verified static releases`,
    print: 'Print / save as PDF', json: 'Download report JSON', back: 'Back to the simulator',
    invalid: 'No valid scenario was supplied in the link. Run a scenario in the simulator first.', recomputing: 'Recomputing the scenario from verified inputs…',
    inputs: 'Inputs and data versions', release: 'Release', hash: 'Manifest SHA-256', results: 'Results', limitations: 'Limitations', limitationsLang: 'Limitations are quoted from each release in English.',
    unknownTitle: 'Not estimated (UNKNOWN)',
    unknownText: 'Inundation depth and extent, building damage, casualties, repair costs, hydropower downtime and economic loss are UNKNOWN: no reviewed inputs and validation exist. Absence of a value here is not zero.',
    releasePoint: 'Release point', path: 'path', hydrograph: 'Hydrograph',
    hydroText: (shape: string, v: string, d: string, peak: string, check: string) => `${shape}, ${v} m³ over ${d}, source peak ${peak} m³/s (volume check ${check} m³). Translated without attenuation.`,
    floodCaption: (cs: string, ws: string) => `Arrival (declared celerities ${cs} m/s) and potential exposure (corridors ${ws} m each side)`,
    distance: 'Distance', front: 'Front arrival', ends: 'Pulse ends', popRange: 'Population (range)', assetRange: 'Mapped assets (range)', partial: '(known subtotal; part of the area UNKNOWN)',
    scenario: 'Scenario', point: 'point source', line: (l: string, s: string) => `${l} km line at ${s}°`, uniform: 'uniform', model: 'Model',
    bandCaption: 'Population by PGA band (median, −1σ, +1σ)', band: 'Band', median: 'Median', beyond: (n: string) => `Population beyond the 400 km model domain (no band): ${n}.`,
  },
  ne: {
    eyebrow: 'परिदृश्य प्रतिवेदन', quakeTitle: 'शैक्षिक भूकम्पीय कम्पन परिदृश्य', floodTitle: 'शैक्षिक बाढी / हिमताल विस्फोट करिडोर परिदृश्य',
    official: 'आधिकारिक पूर्वानुमान र चेतावनी:', generated: (t: string) => `${t} मा तयार (हेर्नेको घडी) · हिमालयन डिजास्टर एटलस · प्रमाणित स्थिर रिलिजबाट पुनर्गणना`,
    print: 'छाप्नुहोस् / PDF बनाउनुहोस्', json: 'प्रतिवेदन JSON डाउनलोड', back: 'सिमुलेटरमा फर्कनुहोस्',
    invalid: 'लिङ्कमा कुनै मान्य परिदृश्य छैन। पहिले सिमुलेटरमा परिदृश्य चलाउनुहोस्।', recomputing: 'प्रमाणित इनपुटबाट परिदृश्य पुनर्गणना गर्दै…',
    inputs: 'इनपुट र डाटा संस्करण', release: 'रिलिज', hash: 'म्यानिफेस्ट SHA-256', results: 'नतिजा', limitations: 'सीमाहरू', limitationsLang: 'सीमाहरू हरेक रिलिजबाट अंग्रेजीमा उद्धृत छन्।',
    unknownTitle: 'अनुमान नगरिएको (UNKNOWN)',
    unknownText: 'डुबानको गहिराइ र क्षेत्र, भवन क्षति, हताहत, मर्मत लागत, जलविद्युत् बन्द अवधि र आर्थिक नोक्सानी अज्ञात (UNKNOWN) छन्: समीक्षा गरिएका इनपुट र प्रमाणीकरण छैनन्। यहाँ मान नहुनु शून्य होइन।',
    releasePoint: 'सुरुवात बिन्दु', path: 'मार्ग', hydrograph: 'हाइड्रोग्राफ',
    hydroText: (shape: string, v: string, d: string, peak: string, check: string) => `${shape === 'triangular' ? 'त्रिकोणीय' : 'आयताकार'}, ${d} मा ${v} m³, स्रोतमा शिखर ${peak} m³/s (आयतन जाँच ${check} m³)। क्षीणताबिना सारिएको।`,
    floodCaption: (cs: string, ws: string) => `आइपुग्ने समय (घोषित गति ${cs} m/s) र सम्भावित जोखिम (दुवैतर्फ ${ws} मिटर करिडोर)`,
    distance: 'दूरी', front: 'अग्रभाग आइपुग्ने', ends: 'प्रवाह सकिने', popRange: 'जनसंख्या (दायरा)', assetRange: 'नक्सांकित संरचना (दायरा)', partial: '(ज्ञात उप-जम्मा; केही क्षेत्र अज्ञात)',
    scenario: 'परिदृश्य', point: 'बिन्दु स्रोत', line: (l: string, s: string) => `${l} km रेखा, ${s}°`, uniform: 'एकरूप', model: 'मोडेल',
    bandCaption: 'PGA समूह अनुसार जनसंख्या (मध्य, −१σ, +१σ)', band: 'समूह', median: 'मध्य', beyond: (n: string) => `४०० km मोडेल दायराभन्दा टाढाको जनसंख्या (समूह छैन): ${n}।`,
  },
};
