import { Analyst } from '../../features/ai-analyst/analyst';
export const metadata = { title: 'AI Analyst' };
export default function AnalystPage() {
  return <article className="page prose"><p className="eyebrow">Atlas analyst</p><h1>Ask the Atlas.</h1>
    <p>Get traceable explanations and calculations from approved Atlas evidence. Source statements, derived calculations, hypothetical model outputs and unknown interpretations stay distinct.</p>
    <Analyst />
    <p>Explore <a href="/evidence/">the evidence corpus</a> or inspect geography in <a href="/atlas/">the Atlas</a>.</p>
  </article>;
}
