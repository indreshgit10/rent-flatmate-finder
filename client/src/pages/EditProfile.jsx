import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, createProfile, updateProfile } from '../services/profileService';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  
  const [formData, setFormData] = useState({
    preferredLocation: '',
    budgetMin: '',
    budgetMax: '',
    moveInDate: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        if (data.data) {
          setIsExisting(true);
          const p = data.data;
          setFormData({
            preferredLocation: p.preferredLocation,
            budgetMin: p.budgetMin,
            budgetMax: p.budgetMax,
            moveInDate: p.moveInDate ? new Date(p.moveInDate).toISOString().split('T')[0] : ''
          });
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError('Failed to load profile');
        }
      } finally {
        setInitialLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const bMin = Number(formData.budgetMin);
    const bMax = Number(formData.budgetMax);

    if (bMin < 0 || bMax < 0) return setError('Budgets must be positive.');
    if (bMin >= bMax) return setError('Minimum budget must be less than maximum budget.');
    
    try {
      setLoading(true);
      const payload = { ...formData, budgetMin: bMin, budgetMax: bMax };
      
      if (isExisting) {
        await updateProfile(payload);
      } else {
        await createProfile(payload);
      }
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-4 mt-8">
      <div className="bg-white p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <h1 className="text-2xl font-bold mb-6">
          {isExisting ? 'Edit Profile' : 'Create Profile'}
        </h1>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Preferred Location</label>
            <input
              type="text"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-transparent"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Min Budget ($)</label>
              <input
                type="number"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded bg-transparent"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Budget ($)</label>
              <input
                type="number"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                required
                min="0"
                className="w-full p-2 border rounded bg-transparent"
                style={{ borderColor: 'var(--color-border)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Move-in Date</label>
            <input
              type="date"
              name="moveInDate"
              value={formData.moveInDate}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-transparent"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded text-white font-medium transition disabled:opacity-50 mt-4"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
