import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [t, setT] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/trainers/${id}`);
        if (!res.ok) throw new Error('Request failed');
        setT(await res.json());
      } catch {
        setError('Could not load this trainer');
      }
      try {
        const res = await fetch(`/api/trainers/${id}/reviews`);
        if (res.ok) setReviews(await res.json());
      } catch {
        // reviews are optional, so ignore errors
      }
    })();
  }, [id]);

  return (
    <div>
      <button className="back" onClick={() => navigate('/trainers')}>&larr; Back</button>
      {error && <div className="msg">{error}</div>}
      {!t && !error && <div className="msg">Loading...</div>}
      {t && (
        <>
          <div className="center">
            {t.photoUrl ? (
              <img className="big-avatar" src={t.photoUrl} alt={t.user.name} />
            ) : (
              <div className="big-avatar">{t.user.name.charAt(0)}</div>
            )}
            <div className="hero">{t.user.name}</div>
            <div className="spec">{t.specialization}</div>
            <div className="meta">{t.location}</div>
            <div className="rating" style={{ marginTop: 6 }}>
              ★ {Number(t.averageRating).toFixed(1)} ({t.reviewCount} reviews)
            </div>
          </div>

          <div className="stats">
            <div className="stat"><b>{t.experienceYears}</b><span>Years Exp.</span></div>
            <div className="stat"><b>Rs. {Number(t.sessionFee).toLocaleString()}</b><span>Per Session</span></div>
          </div>

          {t.bio && <div className="about"><b>About</b>{t.bio}</div>}
          {t.certification && <div className="about"><b>Certification</b>{t.certification}</div>}

          {reviews.length > 0 && (
            <div className="about">
              <b>Reviews</b>
              {reviews.map((r) => (
                <div className="review" key={r.id}>
                  <div className="rating">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}{' '}
                    <span className="meta">{r.client?.name}</span>
                  </div>
                  {r.comment && <div>{r.comment}</div>}
                </div>
              ))}
            </div>
          )}

          <div className="actions" style={{ marginTop: 14 }}>
            <button className="btn solid">Book Slot →</button>
          </div>
        </>
      )}
    </div>
  );
}