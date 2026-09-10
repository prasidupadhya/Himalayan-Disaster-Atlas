import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { excludedReleases, releaseDirectory, unavailableFeatures } from '../../scripts/public-release-policy.mjs';
const webRoot = dirname(fileURLToPath(import.meta.url));
/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  webpack(config, { webpack }) {
    config.plugins.push(new webpack.DefinePlugin({ __ATLAS_PUBLIC_RELEASE__: JSON.stringify(process.env.NEXT_PUBLIC_ATLAS_RELEASE === 'public') }));
    if (process.env.NEXT_PUBLIC_ATLAS_RELEASE === 'public') {
      const excluded = excludedReleases().map(releaseDirectory);
      config.plugins.push(new webpack.NormalModuleReplacementPlugin(/.*/, resource => {
        const absolute = resolve(resource.context, resource.request).replace(/\\/g, '/').replace(/\.tsx?$/, '');
        if (unavailableFeatures.some(feature => absolute === `${webRoot}/features/${feature}`)) {
          resource.request = resolve(webRoot, 'features/public-release/unavailable.tsx');
        }
        if (excluded.some(path => absolute.includes(`/public${path}`))) {
          throw new Error(`Excluded dataset imported into public bundle: ${absolute}`);
        }
      }));
    }
    return config;
  },
  trailingSlash: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};
export default config;
