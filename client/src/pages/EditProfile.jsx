import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, createProfile, updateProfile } from '../services/profileService';

const EditProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [isExisting, setIsExisting] = useState(false);
  
    preferredLocation: '',
    budgetMin: '',
    budgetMax: '',
    moveInDate: '',
    sleepSchedule: '',
    smokingHabit: '',
    drinkingHabit: '',
    petPolicy: '',
    cleanliness: '',
    roomType: '',
    furnishing: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        if (data.data) {
          setIsExisting(true);
          const p = data.data;
          setFormData({
            budgetMin: p.budgetMin || p.budget_min || '',
            budgetMax: p.budgetMax || p.budget_max || '',
            moveInDate: p.moveInDate || p.move_in_date ? new Date(p.moveInDate || p.move_in_date).toISOString().split('T')[0] : '',
            sleepSchedule: p.sleepSchedule || p.sleep_schedule || '',
            smokingHabit: p.smokingHabit || p.smoking_habit || '',
            drinkingHabit: p.drinkingHabit || p.drinking_habit || '',
            petPolicy: p.petPolicy || p.pet_policy || '',
            cleanliness: p.cleanliness || '',
            roomType: p.roomType || p.room_type || '',
            furnishing: p.furnishing || ''
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

  if (initialLoading) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '600px', margin: '3rem auto' }}>
      <div style={{ background: 'var(--color-surface)', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--color-border)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--color-text)' }}>
          {isExisting ? 'Edit Profile' : 'Create Profile'}
        </h1>
        
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Preferred Location</label>
            <input
              type="text"
              name="preferredLocation"
              value={formData.preferredLocation}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Min Budget (₹)</label>
              <input
                type="number"
                name="budgetMin"
                value={formData.budgetMin}
                onChange={handleChange}
                required
                min="0"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Max Budget (₹)</label>
              <input
                type="number"
                name="budgetMax"
                value={formData.budgetMax}
                onChange={handleChange}
                required
                min="0"
                style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Move-in Date</label>
            <input
              type="date"
              name="moveInDate"
              value={formData.moveInDate}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Sleep Schedule</label>
              <select name="sleepSchedule" value={formData.sleepSchedule} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                <option value="">Select...</option>
                <option value="Early Bird">Early Bird</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Smoking Habit</label>
              <select name="smokingHabit" value={formData.smokingHabit} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                <option value="">Select...</option>
                <option value="Non-smoker">Non-smoker</option>
                <option value="Smoker">Smoker</option>
                <option value="Outside Only">Outside Only</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Drinking Habit</label>
              <select name="drinkingHabit" value={formData.drinkingHabit} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                <option value="">Select...</option>
                <option value="Non-drinker">Non-drinker</option>
                <option value="Occasional">Occasional</option>
                <option value="Regular">Regular</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Pet Policy</label>
              <select name="petPolicy" value={formData.petPolicy} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                <option value="">Select...</option>
                <option value="No Pets">No Pets</option>
                <option value="Cats Only">Cats Only</option>
                <option value="Dogs Only">Dogs Only</option>
                <option value="Any Pets">Any Pets</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Cleanliness</label>
              <select name="cleanliness" value={formData.cleanliness} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                <option value="">Select...</option>
                <option value="Strict">Strict</option>
                <option value="Moderate">Moderate</option>
                <option value="Relaxed">Relaxed</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Room Type</label>
              <select name="roomType" value={formData.roomType} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                <option value="">Select...</option>
                <option value="Private Room">Private Room</option>
                <option value="Shared Room">Shared Room</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)', marginBottom: '0.4rem' }}>Furnishing</label>
              <select name="furnishing" value={formData.furnishing} onChange={handleChange} style={{ width: '100%', padding: '0.75rem 1rem', background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', color: 'var(--color-text)' }}>
                <option value="">Select...</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              width: '100%',
              padding: '0.85rem',
              background: loading ? 'var(--color-surface-raised)' : 'var(--color-primary)',
              color: loading ? 'var(--color-text-muted)' : '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
