import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getListingById, markListingAsFilled } from '../services/listingService';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fillLoading, setFillLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await getListingById(id);
        setListing(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  const handleFill = async () => {
    try {
      setFillLoading(true);
      await markListingAsFilled(id);
      setListing((prev) => ({ ...prev, isFilled: true }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark as filled');
    } finally {
      setFillLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center" style={{ color: 'var(--color-text-muted)' }}>Loading listing details...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!listing) return <div className="p-8 text-center">Listing not found.</div>;

  const currentUserId = user?._id || user?.id;
  const listingOwnerId = listing.owner?._id || listing.owner;
  const isOwner = user?.role === 'owner' && currentUserId === listingOwnerId;
  const isTenant = user?.role === 'tenant';

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="bg-white p-6 rounded-lg shadow space-y-6" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <h1 className="text-3xl font-bold">{listing.location}</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ color: 'var(--color-text-muted)' }}>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider">Rent</p>
            <p className="text-lg">${listing.rent}/mo</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider">Room Type</p>
            <p className="text-lg capitalize">{listing.roomType}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider">Furnishing</p>
            <p className="text-lg capitalize">{listing.furnishing}</p>
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider">Available</p>
            <p className="text-lg">{new Date(listing.availableFrom).toLocaleDateString()}</p>
          </div>
        </div>

        {listing.photos && listing.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {listing.photos.map((photo, i) => (
              <img key={i} src={photo} alt={`Room ${i + 1}`} className="w-full h-48 object-cover rounded-lg" />
            ))}
          </div>
        )}

        <div className="p-6 rounded-lg border" style={{ backgroundColor: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
          <h2 className="text-xl font-semibold mb-2">Compatibility Score</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Score pending...</p>
        </div>

        <div className="flex gap-4 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          {isTenant && (
            <button className="px-6 py-2 rounded-lg font-medium transition" style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}>
              Express Interest
            </button>
          )}
          
          {isOwner && !listing.isFilled && (
            <button
              onClick={handleFill}
              disabled={fillLoading}
              className="px-6 py-2 rounded-lg font-medium transition disabled:opacity-50"
              style={{ backgroundColor: '#10b981', color: 'white' }}
            >
              {fillLoading ? 'Marking...' : 'Mark as Filled'}
            </button>
          )}

          {listing.isFilled && (
            <span className="px-6 py-2 rounded-lg font-medium" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text-muted)' }}>
              Filled
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
