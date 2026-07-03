import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getListingById, markListingAsFilled, deleteListing } from '../services/listingService';
import { getScore } from '../services/compatibilityService';
import { sendInterest } from '../services/interestService';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [interestSent, setInterestSent] = useState(false);

  const fetchListing = useCallback(async () => {
    try {
      const { data } = await getListingById(id);
      setListing(data.data);
    } catch (err) {
      setError('Failed to load listing. It may have been removed.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchListing(); }, [fetchListing]);

  useEffect(() => {
    if (user?.role === 'tenant' && listing) {
      setScoreLoading(true);
      getScore(id)
        .then(({ data }) => setScore(data?.data))
        .catch(() => setScore(null))
        .finally(() => setScoreLoading(false));
    }
  }, [user, listing, id]);

  const handleMarkFilled = async () => {
    if (!window.confirm('Are you sure you want to mark this listing as filled? It will no longer appear in search results.')) return;
    setActionLoading(true);
    try {
      await markListingAsFilled(id);
      fetchListing();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as filled');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing permanently?')) return;
    setActionLoading(true);
    try {
      await deleteListing(id);
      navigate('/dashboard/owner');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete listing');
      setActionLoading(false);
    }
  };

  const handleExpressInterest = async () => {
    setActionLoading(true);
    try {
      await sendInterest(id);
      setInterestSent(true);
      alert('Interest request sent successfully!');
    } catch (err) {
      if (err.response?.status === 409) {
        setInterestSent(true);
        alert('You have already expressed interest in this listing.');
      } else {
        alert(err.response?.data?.message || 'Failed to send interest request');
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading listing details...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-danger)' }}>{error}</div>;
  if (!listing) return null;

  const isOwner = user?.role === 'owner' && listing.owner?._id === user.id;
  const isTenant = user?.role === 'tenant';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>{listing.location}</h1>
          <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--color-text)', fontSize: '0.95rem', fontWeight: 500, flexWrap: 'wrap' }}>
            <span style={{ padding: '0.25rem 0.75rem', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-full)' }}>Available from: {new Date(listing.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span style={{ padding: '0.25rem 0.75rem', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-full)', textTransform: 'capitalize' }}>{listing.roomType} Room</span>
            <span style={{ padding: '0.25rem 0.75rem', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-full)', textTransform: 'capitalize' }}>{listing.furnishing}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-primary)', letterSpacing: '-0.5px' }}>
            {listing.rent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            <span style={{ fontSize: '1.25rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>/mo</span>
          </div>
          {listing.isFilled && (
            <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.35rem 0.85rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: 'var(--radius-full)', fontSize: '0.85rem', fontWeight: 600 }}>
              Marked as Filled
            </span>
          )}
        </div>
      </div>

      {listing.photos && listing.photos.length > 0 ? (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2.5rem' }}>
          {listing.photos.map((photo, i) => (
            <img key={i} src={photo} alt={`Room view ${i + 1}`} style={{ height: '350px', borderRadius: 'var(--radius-lg)', objectFit: 'cover', boxShadow: 'var(--shadow-md)' }} />
          ))}
        </div>
      ) : (
        <div style={{ height: '300px', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', marginBottom: '2.5rem', border: '1px dashed var(--color-border)' }}>
          No photos available
        </div>
      )}

      <div className="listing-detail-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>About this listing</h2>
          <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
            Beautiful {listing.roomType} room available in {listing.location}. 
            The property is offered {listing.furnishing}.
            Reach out to express interest and discuss further details!
          </p>
          
          {/* Compatibility Score Section placeholder */}
          <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'var(--color-surface-raised)', borderRadius: '10px', border: '1px solid var(--color-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>Compatibility Score</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              {isTenant ? "Checking your compatibility based on your tenant profile..." : "Scores are visible to prospective tenants based on their preferences."}
            </p>
            {isTenant && (
              <div style={{ marginTop: '1rem' }}>
                {scoreLoading ? (
                  <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: '8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Calculating score...</div>
                ) : score ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 700, color: score.score >= 75 ? '#4ade80' : score.score >= 50 ? '#fbbf24' : '#f87171' }}>
                      {score.score}% Match
                    </div>
                    {score.explanation && <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.5 }}>{score.explanation}</p>}
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Source: {score.source}</span>
                  </div>
                ) : (
                  <div style={{ padding: '1rem', background: 'var(--color-surface)', borderRadius: '8px', textAlign: 'center', color: 'var(--color-text-muted)' }}>Score pending or unavailable</div>
                )}
              </div>
            )}
          </div>
        </div>

        <div>
          <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', position: 'sticky', top: '100px', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Owner Info</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', fontWeight: 500 }}>{listing.owner?.name || 'Unknown'}</p>

            {isOwner && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {!listing.isFilled && (
                  <button 
                    onClick={handleMarkFilled} 
                    disabled={actionLoading}
                    style={{ padding: '0.85rem', background: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
                    onMouseLeave={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
                  >
                    Mark as Filled
                  </button>
                )}
                <button 
                  onClick={handleDelete}
                  disabled={actionLoading}
                  style={{ padding: '0.85rem', background: 'transparent', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }}
                  onMouseEnter={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                  onMouseLeave={(e) => !actionLoading && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Delete Listing
                </button>
              </div>
            )}

            {isTenant && !listing.isFilled && (
              <button 
                onClick={handleExpressInterest}
                disabled={actionLoading || interestSent}
                style={{ width: '100%', padding: '0.85rem', background: interestSent ? 'var(--color-surface-raised)' : 'var(--color-primary)', color: interestSent ? 'var(--color-text-muted)' : '#ffffff', border: interestSent ? '1px solid var(--color-border)' : 'none', borderRadius: 'var(--radius-md)', cursor: (actionLoading || interestSent) ? 'not-allowed' : 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => !(actionLoading || interestSent) && (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
                onMouseLeave={(e) => !(actionLoading || interestSent) && (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
              >
                {interestSent ? 'Interest Sent' : 'Express Interest'}
              </button>
            )}

            {!user && (
              <button 
                onClick={() => navigate('/login')}
                style={{ width: '100%', padding: '0.85rem', background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                Log in to contact owner
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
