/** Project-authored Nepali for the simulation workbench's fixed contract text. English stays as the contract
 * publishes it; anything without an entry here (e.g. engine error detail, dataset limitations) is shown as produced. */

export const ASSUMPTIONS_NE: Record<string, string> = {
  'source-topology': 'स्रोतको NEXT_DOWN मात्र पछ्याइन्छ; स्रोत कभरेज सकिने ठाउँ निकास होइन र कुनै जडान अनुमान गरिँदैन।',
  'whole-reaches': 'छानिएको सम्पूर्ण स्रोत खण्डको माथिल्लो छेउबाट सुरु गरिन्छ। दूरी स्रोतको LENGTH_KM जोडेर निकालिन्छ, क्लिक गरिएको बिन्दुदेखि निकाससम्मको दूरी होइन।',
  'fixed-celerity': 'प्रयोगकर्ताले मानेको एउटै धनात्मक गति (celerity) ले राखिएका प्रत्येक खण्डमा सङ्केतलाई अघि सार्छ; यो मापन गरिएको पानीको वेग होइन।',
  'rectangular-pulse': 'काल्पनिक बहाव आयताकार पल्स (pulse) हो, जसको बहाव (discharge) आयतन/अवधि बराबर स्थिर रहन्छ र अवधिबाहिर थप बहाव शून्य हुन्छ।',
  'no-attenuation': 'शुद्ध स्थानान्तरण मात्र: क्षीणता (attenuation), सञ्चय, फैलावट, सहायक नदीको थप बहाव, नोक्सानी वा प्रतिक्रिया समावेश छैन। परिभाषाअनुसार प्रत्येक खण्डमा आयतन संरक्षित रहन्छ।',
};

export const PARAMETERS_NE: Record<'celerity' | 'release_volume' | 'release_duration', { label: string; explanation: string }> = {
  celerity: { label: 'मानिएको सङ्केत गति (celerity)', explanation: 'स्रोत नदी सञ्जालमा सङ्केत अघि सर्ने गति नियन्त्रण गर्छ। यो मानिएको सङ्केत गति हो, मापन गरिएको पानीको वेग होइन।' },
  release_volume: { label: 'काल्पनिक बहाव आयतन', explanation: 'मान्यताअनुसार प्रत्येक खण्ड-काटमा आयताकार सङ्केतको आयतन निर्धारण गर्छ। यसलाई खण्डहरूमा जोडिँदैन।' },
  release_duration: { label: 'बहावको अवधि', explanation: 'काल्पनिक आयताकार बहाव कति समय सक्रिय रहन्छ भन्ने निर्धारण गर्छ। यो पूर्वानुमानको अवधि होइन।' },
};

export const COMPARISON_ROWS_NE: Record<string, string> = {
  'Source pathway length': 'स्रोत मार्गको लम्बाइ',
  'Assumed signal celerity': 'मानिएको सङ्केत गति (celerity)',
  'Hypothetical release volume': 'काल्पनिक बहाव आयतन',
  'Release duration': 'बहावको अवधि',
  'Rectangular signal discharge': 'आयताकार सङ्केत बहाव (discharge)',
  'Last retained reach exit delay': 'राखिएको अन्तिम खण्डबाट निस्कने ढिलाइ',
};

export const REASONS_NE: Record<string, string> = {
  'Only runs from the same simulation level and model/version are comparable.': 'एउटै सिमुलेसन तह र मोडेल/संस्करणका रनहरू मात्र तुलना गर्न सकिन्छ।',
  'Runs use a different source pathway or verified basis.': 'यी रनहरूले फरक स्रोत मार्ग वा प्रमाणित आधार प्रयोग गर्छन्।',
  'Run another scenario to compare with A.': 'A सँग तुलना गर्न अर्को परिदृश्य चलाउनुहोस्।',
};

/** Nepali for the contract's validation messages; numbers are passed through already formatted. */
export function validationNe(message: string, digits: (text: string) => string): string {
  const label = (english: string) => COMPARISON_ROWS_NE[english] ?? english;
  let match = /^(.+) must be a finite number\.$/.exec(message);
  if (match) return `${label(match[1])} सीमित (finite) सङ्ख्या हुनुपर्छ।`;
  match = /^(.+) must be between (\S+) and (\S+) (\S+)\.$/.exec(message);
  if (match) return `${label(match[1])} ${digits(match[2])} देखि ${digits(match[3])} ${match[4]} बीच हुनुपर्छ।`;
  if (message === 'Level 1 connectivity does not accept physical parameters.') return 'तह १ को जडान विश्लेषणले भौतिक प्यारामिटर स्वीकार गर्दैन।';
  if (message === 'Level 2 requires all three explicit parameters.') return 'तह २ का लागि तीनै वटा स्पष्ट प्यारामिटर आवश्यक छन्।';
  if (message === 'Invalid simulation parameters.') return 'सिमुलेसन प्यारामिटर अमान्य छन्।';
  return message;
}
