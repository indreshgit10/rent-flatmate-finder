import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, IndianRupee, Calendar } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { getScore } from '../services/compatibilityService';

const scoreBadgeColor = (score) => {
  if (score === null || score === undefined) return { bg: 'var(--color-surface-raised)', text: 'var(--color-text-muted)' };
  if (score >= 75) return { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' };
  if (score >= 50) return { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' };
  return { bg: 'rgba(239,68,68,0.15)', text: '#f87171' };
};

const ListingCard = ({ listing, score: initialScore }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    if (user?.role === 'tenant' && (score === null || score === undefined)) {
      getScore(listing._id).then(({ data }) => {
        if (data?.data?.score) {
          setScore(data.data.score);
        }
      }).catch(() => {});
    }
  }, [user, listing._id, score]);

  const badge = scoreBadgeColor(score);

  return (
    <div
      onClick={() => navigate(`/listings/${listing._id}`)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, background-color 0.3s ease, border-color 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{
        width: '100%',
        height: '160px',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        marginBottom: '0.25rem',
        background: 'linear-gradient(135deg, var(--color-surface-raised) 0%, var(--color-border) 100%)',
        position: 'relative'
      }}>
        {listing.photos && listing.photos.length > 0 ? (
          <img 
            src={listing.photos[0]} 
            alt="Property" 
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <MapPin size={32} opacity={0.5} />
          </div>
        )}
        {listing.photos && listing.photos.length > 1 && (
          <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600 }}>
            +{listing.photos.length - 1} photos
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '1.05rem', fontWeight: 600, color: 'var(--color-text)' }}>
          <MapPin size={16} color="var(--color-primary)" />
          {listing.location}
        </span>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          padding: '0.2rem 0.55rem',
          borderRadius: '999px',
          background: badge.bg,
          color: badge.text,
          whiteSpace: 'nowrap',
        }}>
          {score !== null && score !== undefined ? `${score}% match` : 'Score pending'}
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>
        <IndianRupee size={20} strokeWidth={2.5} style={{ marginRight: '2px' }} />
        {listing.rent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)', marginLeft: '4px' }}>/mo</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
        {[listing.roomType, listing.furnishing].map((tag) => (
          <span key={tag} style={{
            fontSize: '0.75rem',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--color-surface-raised)',
            color: 'var(--color-text)',
            textTransform: 'capitalize',
            border: '1px solid var(--color-border)',
            fontWeight: 500,
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
        <Calendar size={14} />
        Available from {new Date(listing.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
  );
};

export default ListingCard;
