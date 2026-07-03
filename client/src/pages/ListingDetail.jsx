import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getListingById, markListingAsFilled, deleteListing } from '../services/listingService';

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

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

  const handleExpressInterest = () => {
    // Will be implemented in Commit 29
    alert('Express Interest functionality coming soon!');
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading listing details...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-danger)' }}>{error}</div>;
  if (!listing) return null;

  const isOwner = user?.role === 'owner' && listing.owner?._id === user.id;
  const isTenant = user?.role === 'tenant';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{listing.location}</h1>
          <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
            <span>Available from: {new Date(listing.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>•</span>
            <span style={{ textTransform: 'capitalize' }}>{listing.roomType} Room</span>
            <span>•</span>
            <span style={{ textTransform: 'capitalize' }}>{listing.furnishing}</span>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary)' }}>
            {listing.rent.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
            <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-text-muted)' }}>/mo</span>
          </div>
          {listing.isFilled && (
            <span style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.6rem', background: 'var(--color-surface-raised)', color: 'var(--color-text-muted)', borderRadius: '4px', fontSize: '0.85rem' }}>
              Marked as Filled
            </span>
          )}
        </div>
      </div>

      {listing.photos && listing.photos.length > 0 ? (
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
          {listing.photos.map((photo, i) => (
            <img key={i} src={photo} alt={`Room view ${i + 1}`} style={{ height: '300px', borderRadius: '10px', objectFit: 'cover' }} />
          ))}
        </div>
      ) : (
        <div style={{ height: '300px', background: 'var(--color-surface-raised)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
          No photos available
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
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
            {/* Will be populated in Commit 30 */}
          </div>
        </div>

        <div>
          <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: '10px', border: '1px solid var(--color-border)', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Owner Info</h3>
            <p style={{ color: 'var(--color-text)', marginBottom: '1.5rem' }}>{listing.owner?.name || 'Unknown'}</p>

            {isOwner && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {!listing.isFilled && (
                  <button 
                    onClick={handleMarkFilled} 
                    disabled={actionLoading}
                    style={{ padding: '0.75rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                  >
                    Mark as Filled
                  </button>
                )}
                <button 
                  onClick={handleDelete}
                  disabled={actionLoading}
                  style={{ padding: '0.75rem', background: 'transparent', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', borderRadius: '6px', cursor: actionLoading ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                >
                  Delete Listing
                </button>
              </div>
            )}

            {isTenant && !listing.isFilled && (
              <button 
                onClick={handleExpressInterest}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
              >
                Express Interest
              </button>
            )}

            {!user && (
              <button 
                onClick={() => navigate('/login')}
                style={{ width: '100%', padding: '0.75rem', background: 'var(--color-surface-raised)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}
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
