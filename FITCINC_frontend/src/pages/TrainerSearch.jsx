import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TrainerSearch() {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ minRating: '', maxFee: '', sortBy: 'rating' });
  const [trainers, setTrainers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (filters.minRating) params.set('minRating', filters.minRating);
        if (filters.maxFee) params.set('maxFee', filters.maxFee);
        params.set('sortBy', filters.sortBy);
        const res = await fetch(`/api/trainers?${params.toString()}`);
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
  }, [q, filters]);

  const setFilter = (key) => (e) => setFilters({ ...filters, [key]: e.target.value });

  return (
    <div>
      <div className="brand">
        FITSYNC<small>Trainer Search &amp; Booking</small>
      </div>

      <div className="banner">
        <b>Find Your Rhythm</b>
        Certified coaches ready for all fitness levels
      </div>

      <div className="search-row">
        <input
          className="search"
          placeholder="Search trainers by name or sport..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="filter-btn" onClick={() => setShowFilters(!showFilters)}>
          Filter
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <label>
            Minimum rating
            <select value={filters.minRating} onChange={setFilter('minRating')}>
              <option value="">Any</option>
              <option value="3">3.0 and up</option>
              <option value="4">4.0 and up</option>
              <option value="4.5">4.5 and up</option>
            </select>
          </label>
          <label>
            Maximum fee per session (Rs.)
            <input
              type="number"
              min="0"
              placeholder="e.g. 3000"
              value={filters.maxFee}
              onChange={setFilter('maxFee')}
            />
          </label>
          <label>
            Sort by
            <select value={filters.sortBy} onChange={setFilter('sortBy')}>
              <option value="rating">Top rated</option>
              <option value="fee">Lowest fee</option>
              <option value="experience">Most experience</option>
            </select>
          </label>
        </div>
      )}

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
              <button className="btn ghost" onClick={() => navigate(`/trainers/${t.id}`)}>
                Profile
              </button>
              <button className="btn solid">Book Slot →</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}