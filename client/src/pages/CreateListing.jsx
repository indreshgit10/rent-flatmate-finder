import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createListing } from '../services/listingService';

const CreateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    location: '',
    rent: '',
    availableFrom: '',
    roomType: 'single',
    furnishing: 'unfurnished',
    sleepSchedule: '',
    smokingHabit: '',
    drinkingHabit: '',
    petPolicy: '',
    cleanliness: '',
    photos: [] // Placeholder for photo URLs
  });

  const [photos, setPhotos] = useState([]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (Number(formData.rent) <= 0) {
      return setError('Rent must be a positive number.');
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(formData.availableFrom);
    if (selectedDate <= today) {
      return setError('Available date must be in the future.');
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('location', formData.location);
      data.append('rent', Number(formData.rent));
      data.append('availableFrom', formData.availableFrom);
      data.append('roomType', formData.roomType);
      data.append('furnishing', formData.furnishing);
      data.append('sleepSchedule', formData.sleepSchedule);
      data.append('smokingHabit', formData.smokingHabit);
      data.append('drinkingHabit', formData.drinkingHabit);
      data.append('petPolicy', formData.petPolicy);
      data.append('cleanliness', formData.cleanliness);
      
      photos.forEach(photo => {
        data.append('photos', photo);
      });

      await createListing(data);
      navigate('/dashboard/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--color-bg)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-text)',
    fontSize: '0.95rem',
  };

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', width: '100%' }}>
      <div style={{ backgroundColor: 'var(--color-surface)', padding: '2.5rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-md)' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text)' }}>Create New Listing</h1>
        <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>Fill in the details to post your property.</p>
        
        {error && (
          <div style={{ background: '#3b1219', border: '1px solid var(--color-danger)', color: '#fca5a5', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={inputStyle}
              placeholder="e.g. Indiranagar, Bangalore"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Rent (₹/month)</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              required
              min="1"
              style={inputStyle}
              placeholder="e.g. 15000"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Available From</label>
            <input
              type="date"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Room Type</label>
              <select
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Private Room">Private Room</option>
                <option value="Shared Room">Shared Room</option>
                <option value="Studio">Studio Apartment</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Furnishing</label>
              <select
                name="furnishing"
                value={formData.furnishing}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Preferred Sleep Schedule</label>
              <select name="sleepSchedule" value={formData.sleepSchedule} onChange={handleChange} style={inputStyle}>
                <option value="">Any</option>
                <option value="Early Bird">Early Bird</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Smoking Policy</label>
              <select name="smokingHabit" value={formData.smokingHabit} onChange={handleChange} style={inputStyle}>
                <option value="">Any</option>
                <option value="Non-smoker">Non-smoker</option>
                <option value="Smoker">Smoker</option>
                <option value="Outside Only">Outside Only</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Drinking Policy</label>
              <select name="drinkingHabit" value={formData.drinkingHabit} onChange={handleChange} style={inputStyle}>
                <option value="">Any</option>
                <option value="Non-drinker">Non-drinker</option>
                <option value="Occasional">Occasional</option>
                <option value="Regular">Regular</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Pet Policy</label>
              <select name="petPolicy" value={formData.petPolicy} onChange={handleChange} style={inputStyle}>
                <option value="">Any</option>
                <option value="No Pets">No Pets</option>
                <option value="Cats Only">Cats Only</option>
                <option value="Dogs Only">Dogs Only</option>
                <option value="Any Pets">Any Pets</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Cleanliness Expectation</label>
              <select name="cleanliness" value={formData.cleanliness} onChange={handleChange} style={inputStyle}>
                <option value="">Any</option>
                <option value="Strict">Strict</option>
                <option value="Moderate">Moderate</option>
                <option value="Relaxed">Relaxed</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.9rem', fontWeight: 500, color: 'var(--color-text-muted)' }}>Property Photos (Up to 5)</label>
            <input
              type="file"
              name="photos"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              style={{ ...inputStyle, padding: '0.5rem' }}
            />
            <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Hold Ctrl/Cmd to select multiple files.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '1rem',
              padding: '0.85rem',
              background: loading ? 'var(--color-surface-raised)' : 'var(--color-primary)',
              color: loading ? 'var(--color-text-muted)' : '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)')}
            onMouseLeave={(e) => !loading && (e.currentTarget.style.backgroundColor = 'var(--color-primary)')}
          >
            {loading ? 'Creating Listing...' : 'Post Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
