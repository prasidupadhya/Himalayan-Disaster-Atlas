/** Copy for the app shell and shared components. Nepali is project-authored and needs native-speaker review before
 * operational reliance. Identifiers, codes and "UNKNOWN" stay verbatim in both languages. */

const shellEn = {
  skip: 'Skip to content',
  tagline: 'Nepal · floods, glacial lakes & earthquakes',
  statement: 'Public, read-only and evidence-traceable. Not an official warning service.',
  explore: 'Explore', map: 'Map', today: 'Today', scenarios: 'Scenarios', allOfficial: 'All official sources', feeds: 'Earthquake and forecast feeds',
  about: 'About', methodology: 'Methodology', sources: 'Sources', licences: 'Licences & attribution',
  evidence: 'Sources and limitations remain linked with every dataset. UNKNOWN remains distinct from zero.',
};
export const SHELL: { en: typeof shellEn; ne: typeof shellEn } = {
  en: shellEn,
  ne: {
    skip: 'सामग्रीमा जानुहोस्',
    tagline: 'नेपाल · बाढी, हिमताल र भूकम्प',
    statement: 'सार्वजनिक, पढ्न मात्र मिल्ने र प्रमाणसँग जोडिएको। आधिकारिक चेतावनी सेवा होइन।',
    explore: 'हेर्नुहोस्', map: 'नक्सा', today: 'आज', scenarios: 'परिदृश्य', allOfficial: 'सबै आधिकारिक स्रोत', feeds: 'भूकम्प र पूर्वानुमान फिड',
    about: 'बारेमा', methodology: 'विधि', sources: 'स्रोतहरू', licences: 'इजाजतपत्र र श्रेय',
    evidence: 'हरेक डेटासेटसँग स्रोत र सीमाहरू जोडिएका छन्। अज्ञात (UNKNOWN) शून्यभन्दा फरक हो।',
  },
};

const themeEn = {
  title: 'Colour theme', system: 'Match device', light: 'Light', dark: 'Dark',
  current: (name: string) => `Colour theme: ${name}`, offline: 'Offline · saved copies',
};
export const THEME: { en: typeof themeEn; ne: typeof themeEn } = {
  en: themeEn,
  ne: { title: 'रङ थिम', system: 'उपकरण अनुसार', light: 'उज्यालो', dark: 'अँध्यारो', current: (name: string) => `रङ थिम: ${name}`, offline: 'अफलाइन · सुरक्षित प्रति' },
};

const stateEn = {
  loading: 'Loading and validating dataset…',
  empty: 'No features are available in this dataset.',
  stale: 'This dataset has passed its update deadline. The archived data remains available.',
  error: 'The dataset could not be validated.',
  unavailable: 'The dataset is currently unavailable.',
  retry: 'Try again',
};
export const DATA_STATE: { en: typeof stateEn; ne: typeof stateEn } = {
  en: stateEn,
  ne: {
    loading: 'डेटासेट लोड र प्रमाणीकरण गर्दै…',
    empty: 'यस डेटासेटमा कुनै विशेषता (feature) उपलब्ध छैन।',
    stale: 'यो डेटासेट अद्यावधिक गर्ने समयसीमा नाघिसकेको छ। संग्रहित डेटा भने उपलब्ध छ।',
    error: 'डेटासेट प्रमाणित गर्न सकिएन।',
    unavailable: 'डेटासेट हाल उपलब्ध छैन।',
    retry: 'फेरि प्रयास गर्नुहोस्',
  },
};

const evidenceEn = {
  region: 'Dataset evidence', fixture: 'Synthetic fixture', evidence: 'Evidence', title: 'Evidence & provenance', unknown: 'UNKNOWN',
  dataset: 'Dataset', source: 'Source', version: 'Dataset version', observation: 'Observation date', publication: 'Publication date', access: 'Access date',
  processingDate: 'Processing date', processingVersion: 'Processing version', resolution: 'Resolution', spatial: 'Spatial coverage', temporal: 'Temporal coverage',
  evidenceType: 'Evidence type', licence: 'License', transformation: 'Transformation, uncertainty & limitations', method: 'Processing method:', uncertainty: 'Uncertainty:',
  attribution: 'Attribution:', manifest: 'Release manifest', directory: 'Source directory', methodology: 'Methodology',
  resolutionUnknown: 'UNKNOWN / source-specific', temporalUnknown: 'UNKNOWN / not applicable',
};
export const EVIDENCE: { en: typeof evidenceEn; ne: typeof evidenceEn } = {
  en: evidenceEn,
  ne: {
    region: 'डेटासेटको प्रमाण', fixture: 'कृत्रिम नमुना (synthetic fixture)', evidence: 'प्रमाण', title: 'प्रमाण र उत्पत्ति', unknown: 'अज्ञात (UNKNOWN)',
    dataset: 'डेटासेट', source: 'स्रोत', version: 'डेटासेट संस्करण', observation: 'अवलोकन मिति', publication: 'प्रकाशन मिति', access: 'प्राप्त गरेको मिति',
    processingDate: 'प्रशोधन मिति', processingVersion: 'प्रशोधन संस्करण', resolution: 'रिजोल्युसन (resolution)', spatial: 'भौगोलिक दायरा', temporal: 'समय दायरा',
    evidenceType: 'प्रमाणको प्रकार', licence: 'इजाजतपत्र (licence)', transformation: 'रूपान्तरण, अनिश्चितता र सीमाहरू', method: 'प्रशोधन विधि:', uncertainty: 'अनिश्चितता:',
    attribution: 'श्रेय (attribution):', manifest: 'रिलिज म्यानिफेस्ट (manifest)', directory: 'स्रोत निर्देशिका', methodology: 'विधि',
    resolutionUnknown: 'अज्ञात (UNKNOWN) / स्रोत अनुसार फरक', temporalUnknown: 'अज्ञात (UNKNOWN) / लागू हुँदैन',
  },
};

const todayEn = {
  region: 'Today from official sources',
  loading: 'Loading today’s official figures…', unavailable: 'Today’s official figures are not available right now.', open: 'Open Today',
  rivers: 'Rivers above warning or danger', rain: 'Rain stations above warning', incidents: 'Incidents in the last 7 days', quake: 'Latest earthquake',
  reported: 'stations reported in 24 h', bipad: 'BIPAD, all types',
  note: (when: string) => `Official copy of ${when}, as published. Not a warning.`, full: 'See today in full',
};
export const TODAY_STRIP: { en: typeof todayEn; ne: typeof todayEn } = {
  en: todayEn,
  ne: {
    region: 'आधिकारिक स्रोतबाट आज',
    loading: 'आजका आधिकारिक अङ्क लोड हुँदैछन्…', unavailable: 'आजका आधिकारिक अङ्क अहिले उपलब्ध छैनन्।', open: 'आज खोल्नुहोस्',
    rivers: 'चेतावनी वा खतरा तहमाथि नदी', rain: 'चेतावनी तहमाथि वर्षा केन्द्र', incidents: 'पछिल्लो ७ दिनका घटना', quake: 'पछिल्लो भूकम्प',
    reported: 'केन्द्रले २४ घण्टामा प्रतिवेदन गरे', bipad: 'BIPAD, सबै प्रकार',
    note: (when: string) => `${when} को आधिकारिक प्रतिलिपि, प्रकाशित रूपमै। चेतावनी होइन।`, full: 'आज पूरा हेर्नुहोस्',
  },
};

const overviewEn = { nepal: 'Nepal', geography: 'Administrative geography', source: 'Source' };
export const OVERVIEW: { en: typeof overviewEn; ne: typeof overviewEn } = { en: overviewEn, ne: { nepal: 'नेपाल', geography: 'प्रशासनिक भूगोल', source: 'स्रोत' } };

const longformEn = { onThisPage: 'On this page', backToTop: 'Back to top' };
export const LONGFORM: { en: typeof longformEn; ne: typeof longformEn } = { en: longformEn, ne: { onThisPage: 'यस पृष्ठमा', backToTop: 'माथि फर्कनुहोस्' } };
