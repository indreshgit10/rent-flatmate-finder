import { useState, useEffect } from 'react';
import { getAllListings, hideListing, unhideListing } from '../../services/adminService';
import { EyeOff, Eye } from 'lucide-react';

const AdminListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await getAllListings(1, 50); // Get first 50 listings
      if (res.data.success) {
        setListings(res.data.data.listings);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch listings');
    } finally {
      setLoading(false);
    }
  };

  const toggleListingVisibility = async (listing) => {
    const action = listing.isHidden ? 'unhide' : 'hide';
    if (!window.confirm(`Are you sure you want to ${action} this listing in ${listing.location}?`)) return;

    try {
      if (listing.isHidden) {
        await unhideListing(listing._id);
      } else {
        await hideListing(listing._id);
      }
      
      // Update local state
      setListings(listings.map(l => 
        l._id === listing._id ? { ...l, isHidden: !l.isHidden } : l
      ));
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} listing`);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading listings...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Platform Listings</h1>
      
      <div style={{ background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-raised)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Location</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Rent / mo</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Owner</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {listings.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No listings found.</td>
              </tr>
            ) : (
              listings.map(listing => (
                <tr key={listing._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{listing.location}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>₹{listing.rent.toLocaleString()}</td>
                  <td style={{ padding: '1rem' }}>{listing.owner?.name || 'Unknown'}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {listing.isFilled ? (
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'var(--color-success)' }}>
                        Filled
                      </span>
                    ) : (
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(234, 179, 8, 0.1)', color: 'var(--color-warning)' }}>
                        Available
                      </span>
                    )}
                    {listing.isHidden && (
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)' }}>
                        Hidden
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <button 
                      onClick={() => toggleListingVisibility(listing)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'transparent',
                        border: `1px solid ${listing.isHidden ? 'var(--color-success)' : 'var(--color-danger)'}`,
                        color: listing.isHidden ? 'var(--color-success)' : 'var(--color-danger)',
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500
                      }}
                    >
                      {listing.isHidden ? <><Eye size={16} /> Unhide</> : <><EyeOff size={16} /> Hide</>}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminListings;
