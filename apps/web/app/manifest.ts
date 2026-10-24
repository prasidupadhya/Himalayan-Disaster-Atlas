import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

/** Lets phones add the atlas to the home screen and open it full screen, like an app. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Himalayan Disaster Atlas', short_name: 'Disaster Atlas',
    description: 'Floods, glacial-lake outbursts and earthquakes in Nepal: official readings, a map and labelled scenarios.',
    start_url: '/', scope: '/', display: 'standalone', orientation: 'any',
    background_color: '#f5f7f8', theme_color: '#ffffff', lang: 'en',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
  };
}
