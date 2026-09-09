// Values are never printed, even on validation failure.
export function checkDeployEnvironment(env = process.env) {
  const missing = ['CLOUDFLARE_API_TOKEN', 'CLOUDFLARE_ACCOUNT_ID'].filter(key => !env[key]?.trim());
  if (missing.length) throw new Error(`Missing deployment environment variables: ${missing.join(', ')}`);
  if (!/^[a-f0-9]{32}$/i.test(env.CLOUDFLARE_ACCOUNT_ID)) throw new Error('Invalid CLOUDFLARE_ACCOUNT_ID format; value withheld.');
  console.log('Deployment environment is configured; values withheld.');
}
checkDeployEnvironment();
