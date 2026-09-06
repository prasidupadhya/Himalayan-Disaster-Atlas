'use client';
export default function ErrorPage({ reset }: { reset: () => void }) { return <section className="page prose" role="alert"><h1>This view could not load.</h1><p>Please try loading it again.</p><button onClick={reset}>Try again</button></section>; }
