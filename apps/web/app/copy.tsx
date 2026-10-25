import Link from 'next/link';

/** Home page copy. Nepali is project-authored and needs native-speaker review before operational reliance. */
const en = {
  intro: 'Floods, glacial-lake outbursts and earthquakes in Nepal: today’s official readings, an interactive map, and scenarios you can run yourself.',
  explore: 'Explore Nepal', today: 'See today', hazardsTitle: 'Three hazards, one map.',
  floods: 'Floods', floodsText: 'River levels and rainfall from DHM stations, flood bulletins and alerts, copied every morning. Then run a hypothetical flood down a real river.',
  floodsToday: 'Today’s river and rain readings', floodsRun: 'Run a flood scenario',
  lakes: 'Glacial lakes', lakesText: 'Thousands of glacial lakes sit above Nepal’s valleys. Pick one on the map and follow where its water would go, river by river.',
  lakesFind: 'Find a lake on the map', lakesRun: 'Run an outburst scenario',
  quakes: 'Earthquakes', quakesText: 'The latest earthquakes recorded by the national seismology centre, shown on a map of Nepal, and shaking scenarios including a Gorkha 2015 replay.',
  quakesLatest: 'Latest recorded earthquakes', quakesRun: 'Run a shaking scenario',
  note: <>Every figure is copied from official sources or labelled as a hypothetical scenario. This is not a warning service; for warnings use <a href="https://www.dhm.gov.np/" rel="noopener">DHM</a> and <a href="https://bipadportal.gov.np/" rel="noopener">BIPAD</a>. <Link href="/methodology/">How it works</Link></>,
};
export const HOME: { en: typeof en; ne: typeof en } = {
  en,
  ne: {
    intro: 'नेपालमा बाढी, हिमताल विस्फोट र भूकम्प: आजका आधिकारिक मापन, अन्तरक्रियात्मक नक्सा, र आफैँ चलाउन सकिने परिदृश्यहरू।',
    explore: 'नेपाल हेर्नुहोस्', today: 'आज हेर्नुहोस्', hazardsTitle: 'तीन प्रकोप, एउटै नक्सा।',
    floods: 'बाढी', floodsText: 'DHM केन्द्रहरूको नदी सतह र वर्षा, बाढी बुलेटिन र सतर्कता, हरेक बिहान प्रतिलिपि गरिन्छ। त्यसपछि वास्तविक नदीमा काल्पनिक बाढी चलाउनुहोस्।',
    floodsToday: 'आजको नदी र वर्षा मापन', floodsRun: 'बाढी परिदृश्य चलाउनुहोस्',
    lakes: 'हिमताल', lakesText: 'नेपालका उपत्यकामाथि हजारौँ हिमताल छन्। नक्सामा एउटा छानेर त्यसको पानी नदी-नदी हुँदै कहाँ जान्छ पछ्याउनुहोस्।',
    lakesFind: 'नक्सामा ताल खोज्नुहोस्', lakesRun: 'विस्फोट परिदृश्य चलाउनुहोस्',
    quakes: 'भूकम्प', quakesText: 'राष्ट्रिय भूकम्प केन्द्रले दर्ता गरेका पछिल्ला भूकम्पहरू नेपालको नक्सामा, र गोरखा २०१५ को पुनरावृत्तिसहित कम्पन परिदृश्यहरू।',
    quakesLatest: 'पछिल्ला दर्ता भूकम्पहरू', quakesRun: 'कम्पन परिदृश्य चलाउनुहोस्',
    note: <>हरेक अङ्क आधिकारिक स्रोतबाट प्रतिलिपि गरिएको वा काल्पनिक परिदृश्य भनी चिन्ह लगाइएको हुन्छ। यो चेतावनी सेवा होइन; चेतावनीका लागि <a href="https://www.dhm.gov.np/" rel="noopener">DHM</a> र <a href="https://bipadportal.gov.np/" rel="noopener">BIPAD</a> हेर्नुहोस्। <Link href="/methodology/">यो कसरी काम गर्छ</Link></>,
  },
};
