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
    photos: [] // Placeholder for photo URLs
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      await createListing({ ...formData, rent: Number(formData.rent) });
      navigate('/dashboard/owner');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <h1 className="text-2xl font-bold mb-6">Create New Listing</h1>
        
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-transparent"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rent ($/month)</label>
            <input
              type="number"
              name="rent"
              value={formData.rent}
              onChange={handleChange}
              required
              min="1"
              className="w-full p-2 border rounded bg-transparent"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Available From</label>
            <input
              type="date"
              name="availableFrom"
              value={formData.availableFrom}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded bg-transparent"
              style={{ borderColor: 'var(--color-border)' }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Room Type</label>
            <select
              name="roomType"
              value={formData.roomType}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-transparent"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="single">Single</option>
              <option value="shared">Shared</option>
              <option value="studio">Studio</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Furnishing</label>
            <select
              name="furnishing"
              value={formData.furnishing}
              onChange={handleChange}
              className="w-full p-2 border rounded bg-transparent"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <option value="unfurnished">Unfurnished</option>
              <option value="semi">Semi-furnished</option>
              <option value="furnished">Furnished</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 rounded text-white font-medium transition disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)' }}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListing;
