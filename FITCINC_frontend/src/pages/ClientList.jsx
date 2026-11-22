import { useCallback, useEffect, useState } from 'react';


const TRAINER_ID = '11111111-1111-1111-1111-111111111111';

function NoteForm({ clientId, onSaved, onCancel }) {
  const [form, setForm] = useState({
    title: '',
    durationMin: '',
    bookingId: '1', 
    notes: '',
    isPersonalRecord: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) =>
    setForm({ ...form, [key]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  async function submit() {
    if (!form.notes.trim()) {
      setError('Please write a note');
      return;
    }
    setSaving(true);
    setError('');
    const body = {
      bookingId: Number(form.bookingId),
      clientId,
      notes: form.notes.trim(),
      isPersonalRecord: form.isPersonalRecord,
    };
    if (form.title.trim()) body.title = form.title.trim();
    if (form.durationMin) body.durationMin = Number(form.durationMin);

    try {
      const res = await fetch(`/api/session-notes?trainerId=${TRAINER_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error('Request failed');
      onSaved();
    } catch {
      setError('Could not save the note');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form">
      <input placeholder="Session title (e.g. Upper Body Push)" value={form.title} onChange={set('title')} />
      <input type="number" placeholder="Duration (minutes)" value={form.durationMin} onChange={set('durationMin')} />
      <input type="number" placeholder="Booking #" value={form.bookingId} onChange={set('bookingId')} />
      <textarea rows="3" placeholder="Notes on performance and progress" value={form.notes} onChange={set('notes')} />
      <label>
        <input type="checkbox" checked={form.isPersonalRecord} onChange={set('isPersonalRecord')} />
        Personal record (PR)
      </label>
      {error && <div className="form-error">{error}</div>}
      <div className="actions">
        <button className="btn ghost" onClick={onCancel}>Cancel</button>
        <button className="btn solid" onClick={submit} disabled={saving}>
          {saving ? 'Saving...' : 'Save Note'}
        </button>
      </div>
    </div>
  );
}

export default function ClientList() {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [noteFor, setNoteFor] = useState(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/session-notes/trainer/${TRAINER_ID}/clients`);
      if (!res.ok) throw new Error('Request failed');
      setClients(await res.json());
      setError('');
    } catch {
      setError('Could not load clients');
    } finally {
      setLoading(false);
    }
  }, []);

    useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const shown = clients.filter((c) =>
    (c.client?.name ?? '').toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="brand">
        FITSYNC<small>Trainer Portal &middot; Clients</small>
      </div>

      <input
        className="search"
        style={{ marginTop: 14 }}
        placeholder="Search clients by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="chips">
        <span className="chip">All Clients {clients.length}</span>
      </div>

      <h2>Client Directory ({shown.length})</h2>

      {loading && <div className="msg">Loading...</div>}
      {error && <div className="msg">{error}</div>}
      {!loading && !error && shown.length === 0 && <div className="msg">No clients found</div>}

      {shown.map((c) => {
        const name = c.client?.name ?? 'Client';
        const clientId = c.client?.id;
        return (
          <div className="card" key={clientId}>
            <div className="row">
              <div className="avatar">{name.charAt(0)}</div>
              <div className="grow">
                <div className="name">{name}</div>
              </div>
              {c.streakWeeks > 0 && <span className="streak">{c.streakWeeks} wk streak</span>}
            </div>

            <div className="stats">
              <div className="stat">
                <b>{c.sessionsDone}</b>
                <span>Sessions Done</span>
              </div>
              <div className="stat">
                <b>{c.consistencyPercent}%</b>
                <span>Consistency</span>
              </div>
            </div>

            <div className="latest">
              <small>LATEST SESSION</small>
              <br />
              {c.latestSession.title}: {c.latestSession.notes}
            </div>

            {noteFor === clientId ? (
              <NoteForm
                clientId={clientId}
                onCancel={() => setNoteFor(null)}
                onSaved={() => {
                  setNoteFor(null);
                  load();
                }}
              />
            ) : (
              <div className="actions">
                <button className="btn solid" onClick={() => setNoteFor(clientId)}>
                  Add Note
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}