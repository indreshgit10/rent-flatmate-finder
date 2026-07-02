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

  if (loading) return <div className="p-8 text-center text-gray-500">Loading profile...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto p-4 mt-8 text-center bg-white rounded-lg shadow" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <h2 className="text-2xl font-bold mb-4">No Profile Yet</h2>
        <p className="text-gray-500 mb-6">Create a profile to get AI-powered compatibility scores and find the perfect flatmate.</p>
        <button
          onClick={() => navigate('/profile/edit')}
          className="px-6 py-2 rounded text-white font-medium transition"
          style={{ backgroundColor: 'var(--color-primary)' }}
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 mt-8">
      <div className="bg-white p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Profile</h1>
          <button
            onClick={() => navigate('/profile/edit')}
            className="px-4 py-2 border rounded hover:bg-gray-50 transition"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          >
            Edit Profile
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <span className="text-sm block" style={{ color: 'var(--color-text-muted)' }}>Preferred Location</span>
            <span className="text-lg font-medium">{profile.preferredLocation}</span>
          </div>
          <div>
            <span className="text-sm block" style={{ color: 'var(--color-text-muted)' }}>Budget Range</span>
            <span className="text-lg font-medium">${profile.budgetMin} - ${profile.budgetMax} /mo</span>
          </div>
          <div>
            <span className="text-sm block" style={{ color: 'var(--color-text-muted)' }}>Move-in Date</span>
            <span className="text-lg font-medium">
              {new Date(profile.moveInDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantProfile;
