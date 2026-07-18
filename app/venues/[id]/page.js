import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVenueById, getEventsForVenue } from '@/lib/queries';
import MonthCalendar from '@/components/MonthCalendar';

export default async function VenuePage({ params }) {
  const venue = await getVenueById(params.id);
  if (!venue) return notFound();

  const events = await getEventsForVenue(params.id);
  const mapSrc = venue.address
    ? `https://www.google.com/maps?q=${encodeURIComponent(venue.address)}&output=embed`
    : null;

  return (
    <main style={{ maxWidth: 720, margin: '0 auto', padding: '2rem 1.5rem' }}>
      <Link href="/" style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-mid)' }}>
        &larr; Back to Gulf Channel
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', margin: '1.2rem 0' }}>
        {venue.logo_url ? (
          <img src={venue.logo_url} alt={venue.name}
            style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 8 }} />
        ) : (
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: venue.accent_color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontFamily: 'var(--display)', fontWeight: 600,
          }}>
            {venue.initials}
          </div>
        )}
        <div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: 26, fontWeight: 600, color: 'var(--ink)' }}>
            {venue.name}
          </h1>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--ink-mid)' }}>
            {venue.town_name}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 12, padding: '1rem 1.2rem' }}>
        <div className="modal-row"><span>Address</span><span>{venue.address}</span></div>
        <div className="modal-row"><span>Category</span><span>{venue.category}</span></div>
        <div className="modal-row"><span>Hours</span><span>{venue.hours}</span></div>
        <div className="modal-row"><span>Rating</span><span>{venue.rating} / 5</span></div>
      </div>

      {mapSrc && (
        <iframe
          src={mapSrc}
          style={{ width: '100%', height: 260, border: 0, borderRadius: 12, marginTop: '1rem' }}
          loading="lazy"
          title={`Map of ${venue.name}`}
        />
      )}

      <h2 style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 600, color: 'var(--ink)', margin: '2rem 0 0.8rem' }}>
        Shows at {venue.name}
      </h2>
      <MonthCalendar
        events={events}
        renderEvent={ev => (
          <Link href={`/performers/${ev.performer_id}`}>{ev.performer_name}</Link>
        )}
      />
    </main>
  );
}
