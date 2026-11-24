import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// TEMP: test client id until login (JWT) is merged
const CLIENT_ID = '44444444-4444-4444-8444-444444444444';

const DAY = 24 * 60 * 60 * 1000;

function dayLabel(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
  if (days < 1) return 'Today';
  if (days < 2) return 'Yesterday';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function RateForm({ noteId, onDone }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit() {
    if (!rating) {
      setError('Choose a star rating');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/reviews?clientId=${CLIENT_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionNoteId: noteId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });
      if (res.status === 409) {
        onDone('You already reviewed this session');
        return;
      }
      if (!res.ok) throw new Error('Request failed');
      onDone('Thanks for your review!');
    } catch {
      setError('Could not save your review');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)}>
            {n <= rating ? '★' : '☆'}
          </button>
        ))}
      </div>
      <textarea
        rows="2"
        placeholder="How was your session? (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && <div className="form-error">{error}</div>}
      <div className="actions">
        <button className="btn ghost" onClick={() => onDone(null)}>Cancel</button>
        <button className="btn solid" onClick={submit} disabled={saving}>
          {saving ? 'Saving...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

export default function WorkoutProgress() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rateFor, setRateFor] = useState(null);
  const [done, setDone] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/session-notes/client/${CLIENT_ID}`);
        if (!res.ok) throw new Error('Request failed');
        setNotes(await res.json());
      } catch {
        setError('Could not load your workouts');
      } finally {
        setLoading(false);
      }
      try {
        const res = await fetch(`/api/session-notes/client/${CLIENT_ID}/summary`);
        if (res.ok) setSummary(await res.json());
      } catch {
        // the weekly card is optional
      }
    })();
  }, []);

  return (
    <div>
      <div className="brand">
        FITSYNC<small>Workout Progress</small>
      </div>

      <span className="pill">STEADY &amp; STRONG</span>
      <div className="hero">Your Fitness Journey</div>
      <div className="sub">
        Every rep counts. You&apos;re building a healthy, sustainable rhythm one day at a time!
      </div>

      <div className="tip">
        <b>Beginner Friendly Reminder</b>
        Feeling mild soreness 24-48 hours later is completely natural. Hydrate well and try 5
        minutes of gentle walking or stretching today.
      </div>

      {summary && (
        <div className="wk">
          <div className="meta">WEEKLY TARGET</div>
          <div className="wk-title">
            {summary.workoutsThisWeek} of {summary.weeklyTarget} Sessions Done
          </div>
          <div className="stats">
            <div className="stat"><b>{summary.minutesActive}</b><span>Mins Active</span></div>
            <div className="stat"><b>{summary.workoutsThisWeek}</b><span>Workouts</span></div>
            <div className="stat"><b>{summary.streakWeeks} Wks</b><span>Streak</span></div>
          </div>
        </div>
      )}

      <h2>Recent Workouts &amp; Notes</h2>

      {loading && <div className="msg">Loading...</div>}
      {error && <div className="msg">{error}</div>}
      {!loading && !error && notes.length === 0 && (
        <div className="msg">No workouts yet. Book your first session!</div>
      )}

      {notes.map((n) => (
        <div className="wk" key={n.id}>
          <div className="wk-top">
            <div className="grow">
              <div className="tags">
                <span className="tag-day">{dayLabel(n.createdAt)}</span>
                {n.isPersonalRecord && <span className="tag-pr">PR Made</span>}
              </div>
              <div className="wk-title">{n.title}</div>
              <div className="coach">Coach {n.trainer?.name ?? 'Trainer'}</div>
            </div>
            {n.durationMin && <span className="dur">{n.durationMin} min</span>}
          </div>
          <div className="quote">&ldquo;{n.notes}&rdquo;</div>

          {done[n.id] ? (
            <div className="thanks">{done[n.id]}</div>
          ) : rateFor === n.id ? (
            <RateForm
              noteId={n.id}
              onDone={(msg) => {
                if (msg) setDone({ ...done, [n.id]: msg });
                setRateFor(null);
              }}
            />
          ) : (
            <div className="actions" style={{ marginTop: 10 }}>
              <button className="btn ghost" onClick={() => setRateFor(n.id)}>
                Rate this session
              </button>
            </div>
          )}
        </div>
      ))}

      <div className="cta">
        <b>Celebrate Your Wins!</b>
        Keep the positive loop spinning
        <button className="btn" onClick={() => navigate('/trainers')}>
          Book Next
        </button>
      </div>
    </div>
  );
}