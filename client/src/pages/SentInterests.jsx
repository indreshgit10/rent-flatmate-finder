import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getSentInterests } from '../services/interestService';

import { MessageCircle, CheckCircle, Clock, XCircle, MapPin, IndianRupee } from 'lucide-react';

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

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading sent requests...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text)' }}>Sent Interests</h1>
      
      {requests.length === 0 ? (
        <div style={{ background: 'var(--color-surface)', padding: '3rem 2rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', textAlign: 'center', border: '1px solid var(--color-border)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>You haven't sent any interest requests yet.</p>
          <button
            onClick={() => navigate('/listings')}
            style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: '#ffffff', borderRadius: 'var(--radius-md)', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            Browse Listings
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {requests.map((req) => (
            <div key={req._id} className="interest-card" style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', transition: 'transform 0.2s ease', cursor: 'default' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div>
                <Link to={`/listings/${req.listing._id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-primary)', textDecoration: 'none', marginBottom: '0.25rem' }}>
                  <MapPin size={18} /> {req.listing.location}
                </Link>
                <div style={{ display: 'flex', gap: '1rem', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', alignItems: 'center' }}>
                  <span>Owner: <strong style={{ color: 'var(--color-text)' }}>{req.owner.name}</strong></span>
                  <span style={{ display: 'flex', alignItems: 'center' }}><IndianRupee size={12} strokeWidth={3} /> {req.listing.rent.toLocaleString('en-IN')}/mo</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, padding: '0.2rem 0.6rem', borderRadius: 'var(--radius-full)', background: req.status === 'accepted' ? 'rgba(34,197,94,0.15)' : req.status === 'declined' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: req.status === 'accepted' ? '#4ade80' : req.status === 'declined' ? '#f87171' : '#fbbf24', textTransform: 'capitalize' }}>
                    {req.status === 'accepted' && <CheckCircle size={14} />}
                    {req.status === 'declined' && <XCircle size={14} />}
                    {req.status === 'pending' && <Clock size={14} />}
                    {req.status}
                  </div>
                  {req.compatibilityScore !== null && (
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-primary)' }}>
                      Match: {req.compatibilityScore}%
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                {req.status === 'accepted' && (
                  <button
                    onClick={() => navigate(`/chat/${req._id}`)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', background: 'var(--color-primary)', color: '#ffffff', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
                  >
                    <MessageCircle size={18} />
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
