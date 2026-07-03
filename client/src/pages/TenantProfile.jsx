import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/profileService';

const TenantProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setProfile(data.data);
      } catch (err) {
        if (err.response?.status === 404) {
          setProfile(null);
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading profile...</div>;
  if (error) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-danger)' }}>{error}</div>;

  if (!profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--color-text)' }}>No Profile Yet</h2>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>Create a profile to get AI-powered compatibility scores and find the perfect flatmate.</p>
        <button
          onClick={() => navigate('/profile/edit')}
          style={{ padding: '0.75rem 1.5rem', background: 'var(--color-primary)', color: '#ffffff', borderRadius: 'var(--radius-md)', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '700px', margin: '3rem auto' }}>
      <div style={{ background: 'var(--color-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-text)' }}>My Profile</h1>
          <button
            onClick={() => navigate('/profile/edit')}
            style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)', cursor: 'pointer', fontWeight: 600, transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            Edit Profile
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          <div style={{ padding: '1.5rem', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>Preferred Location</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)' }}>{profile.preferredLocation}</span>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>Budget Range</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)' }}>₹{profile.budgetMin.toLocaleString()} - ₹{profile.budgetMax.toLocaleString()} /mo</span>
          </div>
          <div style={{ padding: '1.5rem', background: 'var(--color-surface-raised)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ display: 'block', fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '0.3rem' }}>Move-in Date</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text)' }}>
              {new Date(profile.moveInDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;
