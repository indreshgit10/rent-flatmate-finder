import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceivedInterests, acceptInterest, declineInterest } from '../services/interestService';

const ReceivedInterests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const { data } = await getReceivedInterests({ limit: 100 });
        setRequests(data.data.interests);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch requests');
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'accept') {
        await acceptInterest(id);
      } else {
        await declineInterest(id);
      }
      setRequests((prev) =>
        prev.map((req) =>
          req._id === id ? { ...req, status: action === 'accept' ? 'accepted' : 'declined' } : req
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} request`);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading received requests...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 mt-8">
      <h1 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Received Interests</h1>
      
      {requests.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow text-center" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
          <p className="text-gray-500">You haven't received any interest requests yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div key={req._id} className="bg-white p-6 rounded-lg shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
              <div>
                <p className="text-lg font-semibold">{req.tenant.name}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Interested in: <span className="font-medium">{req.listing.location}</span> (${req.listing.rent}/mo)
                </p>
                <p className="text-sm mt-1">
                  Status: <span className="font-medium capitalize px-2 py-0.5 rounded bg-gray-100 text-gray-800">{req.status}</span>
                </p>
              </div>
              
              <div className="flex gap-2">
                {req.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(req._id, 'accept')}
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition font-medium"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleAction(req._id, 'decline')}
                      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-medium"
                    >
                      Decline
                    </button>
                  </>
                )}
                {req.status === 'accepted' && (
                  <button
                    onClick={() => navigate('/chat')}
                    className="px-4 py-2 rounded text-white transition font-medium"
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

export default ReceivedInterests;
