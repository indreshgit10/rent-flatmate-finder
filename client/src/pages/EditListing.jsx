import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListingById, updateListing } from '../services/listingService';

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    location: '',
    rent: '',
    availableFrom: '',
    roomType: 'single',
    furnishing: 'unfurnished',
    photos: []
  });

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const { data } = await getListingById(id);
        const listing = data.data;
        // Format date to YYYY-MM-DD for input type="date"
        const formattedDate = listing.availableFrom 
          ? new Date(listing.availableFrom).toISOString().split('T')[0]
          : '';
          
        setFormData({
          location: listing.location,
          rent: listing.rent,
          availableFrom: formattedDate,
          roomType: listing.roomType,
          furnishing: listing.furnishing,
          photos: listing.photos || []
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load listing');
      } finally {
        setInitialLoading(false);
      }
    };
    fetchListing();
  }, [id]);

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
      await updateListing(id, { ...formData, rent: Number(formData.rent) });
      navigate(`/listings/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update listing');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow" style={{ backgroundColor: 'var(--color-surface)', color: 'var(--color-text)' }}>
        <h1 className="text-2xl font-bold mb-6">Edit Listing</h1>
        
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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditListing;
