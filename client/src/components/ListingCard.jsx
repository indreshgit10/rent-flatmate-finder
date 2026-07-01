import { useNavigate } from 'react-router-dom';

const scoreBadgeColor = (score) => {
  if (score === null || score === undefined) return { bg: 'var(--color-surface-raised)', text: 'var(--color-text-muted)' };
  if (score >= 75) return { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' };
  if (score >= 50) return { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' };
  return { bg: 'rgba(239,68,68,0.15)', text: '#f87171' };
};

const ListingCard = ({ listing, score }) => {
  const navigate = useNavigate();
  const badge = scoreBadgeColor(score);

  return (
    <div
      onClick={() => navigate(`/listings/${listing._id}`)}
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: '10px',
        padding: '1.25rem',
        cursor: 'pointer',
        transition: 'transform 0.15s, box-shadow 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--color-text)' }}>
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

      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary)' }}>
        {listing.rent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
        <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--color-text-muted)' }}> /mo</span>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
        {[listing.roomType, listing.furnishing].map((tag) => (
          <span key={tag} style={{
            fontSize: '0.75rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            background: 'var(--color-surface-raised)',
            color: 'var(--color-text-muted)',
            textTransform: 'capitalize',
            border: '1px solid var(--color-border)',
          }}>
            {tag}
          </span>
        ))}
      </div>

      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
        Available from {new Date(listing.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      </div>
    </div>
  );
};

export default ListingCard;
