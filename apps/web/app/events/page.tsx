import type { Metadata } from 'next';
import { EventPages } from '../../features/event-pages/event-pages';

export const metadata: Metadata = { title: 'Historical Event Pages', description: 'Evidence-backed historical disaster event records for Nepal.' };

export default function EventsPage() {
  return <EventPages />;
}
