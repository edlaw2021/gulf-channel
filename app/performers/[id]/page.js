import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPerformerById, getEventsForPerformer } from '@/lib/queries';
import MonthCalendar from '@/components/MonthCalendar';

export default async function PerformerPage({ params }) {
  const performer = await getPerformerById(params.id);
  if (!performer) return notFound();

  const events = await getEventsForPerformer(params.id);

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link href="/" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-mid)' }}>
        &larr; Back to Gulf Channel
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', margin: '1.2rem 0' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: 'var(--teal)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontFamily: 'var(--display)', fontWeight: 600, fontSize: 18,
        }}>
          {performer.name.slice(0, 2).toUpperCase()}
        </div>
        <h1 style={{ fontFamily: 'var(--display)', fontSize: 26, fontWeight: 600, color: 'var(--ink)' }}>
          {performer.name}
        </h1>
      </div>

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '1rem 0 0.8rem' }}>
        Where {performer.name} is playing
      </h2>
      <MonthCalendar
        events={events}
        renderEvent={ev => (
          <Link href={`/venues/${ev.venue_id}`}>{ev.venue_name} ({ev.act_type})</Link>
        )}
      />
    </main>
  );
}
