import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrainerSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [trainers, setTrainers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/trainers?q=${encodeURIComponent(q)}`);
        if (!res.ok) throw new Error('Request failed');
        const body = await res.json();
        setTrainers(body.data);
        setTotal(body.total);
        setError('');
      } catch {
        setError('Could not load trainers');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="app">
      <div className="brand">
        FITSYNC<small>Trainer Search &amp; Booking</small>
      </div>

      <div className="banner">
        <b>Find Your Rhythm</b>
        Certified coaches ready for all fitness levels
      </div>

      <input
        className="search"
        placeholder="Search trainers by name or sport..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      <h2>Available Trainers ({total})</h2>

      {loading && <div className="msg">Loading...</div>}
      {error && <div className="msg">{error}</div>}
      {!loading && !error && trainers.length === 0 && (
        <div className="msg">No trainers found</div>
      )}

      {trainers.map((t) => {
        const name = t.user?.name ?? 'Trainer';
        return (
          <div className="card" key={t.id}>
            <div className="row">
              {t.photoUrl ? (
                <img className="avatar" src={t.photoUrl} alt={name} />
              ) : (
                <div className="avatar">{name.charAt(0)}</div>
              )}
              <div className="grow">
                <div className="name">{name}</div>
                <div className="spec">{t.specialization}</div>
                <div className="meta">{t.location}</div>
              </div>
              <div className="rating">
                ★ {Number(t.averageRating).toFixed(1)} ({t.reviewCount})
              </div>
            </div>

            <div className="slot">
              <span className="meta">NEXT SLOT: coming soon</span>
              <span className="price">
                Rs. {Number(t.sessionFee).toLocaleString()}
                <span className="meta"> /session</span>
              </span>
            </div>

            <div className="actions">
              <button className="btn ghost" onClick={() => navigate(`/trainers/${t.id}`)}>Profile</button>
              <button className="btn solid">Book Slot →</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}