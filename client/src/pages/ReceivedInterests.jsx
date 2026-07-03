import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReceivedInterests, acceptInterest, declineInterest } from '../services/interestService';

import { MessageCircle, CheckCircle, Clock, XCircle, User, MapPin, IndianRupee } from 'lucide-react';

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

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading received requests...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text)' }}>Received Interests</h1>
      
      {requests.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>You haven't received any interest requests yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req) => (
            <div key={req._id} className="interest-card" style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', transition: 'transform 0.2s ease', cursor: 'default' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.25rem' }}>
                  <User size={18} color="var(--color-primary)" /> {req.tenant.name}
                </p>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><MapPin size={12} /> {req.listing.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><IndianRupee size={12} strokeWidth={3} /> {req.listing.rent.toLocaleString('en-IN')}/mo</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: req.status === 'accepted' ? 'rgba(34,197,94,0.15)' : req.status === 'declined' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: req.status === 'accepted' ? '#4ade80' : req.status === 'declined' ? '#f87171' : '#fbbf24', textTransform: 'capitalize' }}>
                    {req.status === 'accepted' && <CheckCircle size={14} />}
                    {req.status === 'declined' && <XCircle size={14} />}
                    {req.status === 'pending' && <Clock size={14} />}
                    {req.status}
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {req.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAction(req._id, 'accept')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: '#22c55e', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#22c55e')}
                    >
                      <CheckCircle size={16} /> Accept
                    </button>
                    <button
                      onClick={() => handleAction(req._id, 'decline')}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'transparent', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <XCircle size={16} /> Decline
                    </button>
                  </>
                )}
                {req.status === 'accepted' && (
                  <button
                    onClick={() => navigate(`/chat/${req._id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
                  >
                    <MessageCircle size={18} /> Go to Chat
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
