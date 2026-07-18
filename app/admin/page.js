'use client';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [venues, setVenues] = useState([]);
  const [performers, setPerformers] = useState([]);
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [addingNewPerformer, setAddingNewPerformer] = useState(false);

  const [form, setForm] = useState({
    venueId: '', date: '', startTime: '', endTime: '', performerId: '', actType: 'band',
  });
  const [newPerformerName, setNewPerformerName] = useState('');

  useEffect(() => {
    fetch('/api/venues').then(r => r.json()).then(setVenues);
    fetch('/api/admin/performers').then(r => r.json()).then(setPerformers);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('saving');

    let performerId = form.performerId;

    if (addingNewPerformer) {
      const perfRes = await fetch('/api/admin/performers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
        body: JSON.stringify({ name: newPerformerName }),
      });
      if (!perfRes.ok) { setStatus('error'); return; }
      const created = await perfRes.json();
      performerId = created.id;
    }

    const res = await fetch('/api/admin/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ ...form, performerId }),
    });
    setStatus(res.ok ? 'saved' : 'error');
    if (res.ok) {
      setForm({ ...form, performerId: '' });
      setNewPerformerName('');
      setAddingNewPerformer(false);
      fetch('/api/admin/performers').then(r => r.json()).then(setPerformers);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Add a booking</h1>
        <p style={styles.subheading}>Real date, real venue, real performer — this is what fixes the &ldquo;plays forever every Monday&rdquo; problem.</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Admin password
            <input type="password" style={styles.input} value={password}
              onChange={e => setPassword(e.target.value)} required />
          </label>

          <label style={styles.label}>
            Venue
            <select style={styles.input} value={form.venueId}
              onChange={e => setForm({ ...form, venueId: e.target.value })} required>
              <option value="">Select venue…</option>
              {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </label>

          <div style={styles.row}>
            <label style={{ ...styles.label, flex: 1 }}>
              Date
              <input type="date" style={styles.input} value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })} required />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              Start time
              <input type="time" style={styles.input} value={form.startTime}
                onChange={e => setForm({ ...form, startTime: e.target.value })} />
            </label>
            <label style={{ ...styles.label, flex: 1 }}>
              End time
              <input type="time" style={styles.input} value={form.endTime}
                onChange={e => setForm({ ...form, endTime: e.target.value })} />
            </label>
          </div>

          <div style={styles.performerToggle}>
            <button type="button"
              style={!addingNewPerformer ? styles.toggleActive : styles.toggleInactive}
              onClick={() => setAddingNewPerformer(false)}>
              Existing performer
            </button>
            <button type="button"
              style={addingNewPerformer ? styles.toggleActive : styles.toggleInactive}
              onClick={() => setAddingNewPerformer(true)}>
              + New performer
            </button>
          </div>

          {!addingNewPerformer ? (
            <label style={styles.label}>
              Performer
              <select style={styles.input} value={form.performerId}
                onChange={e => setForm({ ...form, performerId: e.target.value })}
                required={!addingNewPerformer}>
                <option value="">Select performer…</option>
                {performers.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </label>
          ) : (
            <label style={styles.label}>
              Performer name
              <input type="text" style={styles.input} value={newPerformerName}
                onChange={e => setNewPerformerName(e.target.value)}
                required={addingNewPerformer} />
            </label>
          )}

          <label style={styles.label}>
            Act size for this booking
            <select style={styles.input} value={form.actType}
              onChange={e => setForm({ ...form, actType: e.target.value })}>
              <option value="solo">Solo</option>
              <option value="duo">Duo</option>
              <option value="band">Band</option>
            </select>
          </label>

          <button type="submit" style={styles.submit} disabled={status === 'saving'}>
            {status === 'saving' ? 'Saving…' : 'Save booking'}
          </button>

          {status === 'saved' && <p style={styles.success}>Saved.</p>}
          {status === 'error' && <p style={styles.error}>Something went wrong — check the password and try again.</p>}
        </form>
      </div>
    </main>
  );
}

const styles = {
  page: {
    minHeight: '100vh', background: 'var(--bg)', display: 'flex',
    justifyContent: 'center', padding: '3rem 1.5rem', fontFamily: 'var(--sans)',
  },
  card: {
    background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 16,
    padding: '2rem', maxWidth: 480, width: '100%', boxShadow: '0 4px 18px rgba(28,59,69,0.08)',
  },
  heading: { fontFamily: 'var(--display)', fontSize: 24, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 },
  subheading: { fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--ink-mid)', marginBottom: '1.5rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '1.1rem' },
  row: { display: 'flex', gap: '0.8rem' },
  label: {
    display: 'flex', flexDirection: 'column', gap: 6,
    fontFamily: 'var(--mono)', fontSize: 11.5, textTransform: 'uppercase',
    letterSpacing: '0.04em', color: 'var(--ink-mid)',
  },
  input: {
    fontFamily: 'var(--sans)', fontSize: 14, color: 'var(--ink)',
    background: '#fff', border: '1px solid var(--border)', borderRadius: 999,
    padding: '0.65rem 1rem', outline: 'none', minHeight: 44,
  },
  performerToggle: { display: 'flex', gap: 8 },
  toggleActive: {
    fontFamily: 'var(--mono)', fontSize: 11.5, padding: '0.5rem 1rem', borderRadius: 999,
    border: '1px solid var(--teal)', background: 'var(--teal)', color: '#fff', cursor: 'pointer',
  },
  toggleInactive: {
    fontFamily: 'var(--mono)', fontSize: 11.5, padding: '0.5rem 1rem', borderRadius: 999,
    border: '1px solid var(--border)', background: 'var(--panel)', color: 'var(--ink-mid)', cursor: 'pointer',
  },
  submit: {
    fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, color: '#fff',
    background: 'var(--teal)', border: 'none', borderRadius: 999,
    padding: '0.85rem', cursor: 'pointer', minHeight: 44,
  },
  success: { fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--teal-dark)' },
  error: { fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--flag-red)' },
};
