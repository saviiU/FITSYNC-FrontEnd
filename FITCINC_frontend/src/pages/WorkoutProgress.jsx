import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CLIENT_ID = '44444444-4444-4444-8444-444444444444';

const DAY = 24 * 60 * 60 * 1000;

function dayLabel(iso) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
  if (days < 1) return 'Today';
  if (days < 2) return 'Yesterday';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WorkoutProgress() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);

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
    })();
  }, []);

  useEffect(() => {
    fetch(`/api/session-notes/client/${CLIENT_ID}/summary`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setSummary)
      .catch(() => {});
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