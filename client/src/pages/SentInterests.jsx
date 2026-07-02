import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSentInterests } from '../services/interestService';

const SentInterests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await getSentInterests({ limit: 100 });
        setRequests(data.data.interests);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sent requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading sent requests...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Sent Interests</h1>
      
      {requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
          <p className="text-gray-500">You haven't sent any interest requests yet.</p>
          <button
            onClick={() => navigate('/listings')}
            className="mt-4 px-6 py-2 rounded text-white font-medium transition"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            Browse Listings
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
              <div>
                <Link to={`/listings/${req.listing._id}`} className="text-lg font-semibold hover:underline" style={{ color: 'var(--color-primary)' }}>
                  {req.listing.location}
                </Link>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Owner: <span className="font-medium text-gray-700">{req.owner.name}</span> | Rent: ${req.listing.rent}/mo
                </p>
                
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-sm">
                    Status: <span className="font-medium capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-800">{req.status}</span>
                  </p>
                  {req.compatibilityScore !== null && (
                    <p className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>
                      Compatibility: {req.compatibilityScore}%
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                {req.status === 'accepted' && (
                  <button
                    onClick={() => navigate('/chat')}
                    className="px-6 py-2 rounded text-white transition font-medium"
                    style={{ backgroundColor: 'var(--color-primary)' }}
                  >
                    Go to Chat
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentInterests;
