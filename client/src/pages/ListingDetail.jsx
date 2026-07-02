import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getListingById, markListingAsFilled } from '../services/listingService';
import { sendInterest, getSentInterests } from '../services/interestService';

const ListingDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fillLoading, setFillLoading] = useState(false);
  
  const [interestRequest, setInterestRequest] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

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

  useEffect(() => {
    if (user?.role === 'tenant') {
      const fetchInterest = async () => {
        try {
          const { data } = await getSentInterests({ limit: 100 });
          const existing = data.data.interests.find(i => i.listing._id === id || i.listing === id);
          if (existing) {
            setInterestRequest(existing);
          }
        } catch (err) {
          console.error('Failed to fetch interests', err);
        }
      };
      fetchInterest();
    }
  }, [id, user]);

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

  const handleExpressInterest = async () => {
    try {
      setActionLoading(true);
      const { data } = await sendInterest(id);
      setInterestRequest(data.data);
      alert('Interest sent successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send interest');
    } finally {
      setActionLoading(false);
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
          {isTenant && !interestRequest && (
            <button 
              onClick={handleExpressInterest}
              disabled={actionLoading || listing.isFilled}
              className="px-6 py-2 rounded-lg font-medium transition disabled:opacity-50" 
              style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
            >
              {actionLoading ? 'Sending...' : 'Express Interest'}
            </button>
          )}

          {isTenant && interestRequest && (
            <div className="flex items-center gap-4">
              <span className="px-4 py-2 rounded-lg border font-medium capitalize" style={{ backgroundColor: 'var(--color-surface-raised)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}>
                Status: {interestRequest.status}
              </span>
              {interestRequest.status === 'accepted' && (
                <button
                  onClick={() => navigate(`/chat/${interestRequest._id}`)}
                  className="px-6 py-2 rounded-lg font-medium transition"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  Go to Chat
                </button>
              )}
            </div>
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
