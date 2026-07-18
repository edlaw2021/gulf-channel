'use client';
import { useState, useEffect } from 'react';

// The whole "someone texts me this week's lineup and I type it in" workflow.
// No scraping, no OCR — just a form that writes a real dated row to `events`.
export default function AdminPage() {
  const [venues, setVenues] = useState([]);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [form, setForm] = useState({
    venueId: '', date: '', startTime: '', endTime: '', performerName: '', actType: 'band',
  });

  useEffect(() => {
    fetch('/api/venues').then(r => r.json()).then(setVenues);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');
    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? 'saved' : 'error');
    if (res.ok) setForm({ ...form, performerName: '' });
  }

  return (
    <main style={{ maxWidth: 480, margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Add a booking</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <input type="password" placeholder="Admin password" value={password}
          onChange={e => setPassword(e.target.value)} required />

        <select value={form.venueId} onChange={e => setForm({ ...form, venueId: e.target.value })} required>
          <option value="">Select venue…</option>
          {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
        </select>

        <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required />
        <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} />
        <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} />
        <input type="text" placeholder="Performer name" value={form.performerName}
          onChange={e => setForm({ ...form, performerName: e.target.value })} required />

        <select value={form.actType} onChange={e => setForm({ ...form, actType: e.target.value })}>
          <option value="solo">Solo</option>
          <option value="duo">Duo</option>
          <option value="band">Band</option>
        </select>

        <button type="submit">Save booking</button>
        {status === 'saved' && <p>Saved.</p>}
        {status === 'error' && <p>Something went wrong — check the password and try again.</p>}
      </form>
    </main>
  );
}
