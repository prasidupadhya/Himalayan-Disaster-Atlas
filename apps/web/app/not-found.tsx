import Link from 'next/link';
export default function NotFound() { return <div className="page prose"><p className="eyebrow">404</p><h1>This page is unavailable.</h1><p><Link href="/atlas/">Return to the atlas</Link></p></div>; }
