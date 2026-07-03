import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Inbox, PlusCircle, Building, Search } from 'lucide-react';
import ReceivedInterests from './ReceivedInterests';
import ListingCard from '../components/ListingCard';
import { getOwnerListings, deleteListing } from '../services/listingService';

const OwnerDashboard = () => {
  const [activeTab, setActiveTab] = useState('interests');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'listings') {
      const fetchOwnerListings = async () => {
        try {
          setLoading(true);
          // Assuming you have imported getOwnerListings from listingService
          const { data } = await getOwnerListings();
          setListings(data.data.listings || []);
        } catch (err) {
          console.error('Failed to fetch owner listings:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchOwnerListings();
    }
  }, [activeTab]);

  const tabStyle = (isActive) => ({
    padding: '0.75rem 1.5rem',
    cursor: 'pointer',
    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
    fontWeight: isActive ? 600 : 500,
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s',
    background: 'none',
    borderTop: 'none',
    borderLeft: 'none',
    borderRight: 'none',
    fontSize: '1rem',
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>Owner Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Manage your properties and review applicant requests.</p>
        </div>
        
        <Link 
          to="/listings/create" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)' }}
        >
          <PlusCircle size={18} />
          Post New Listing
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--color-border)', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('interests')} 
          style={tabStyle(activeTab === 'interests')}
        >
          <Inbox size={18} />
          Interest Requests
        </button>
        <button 
          onClick={() => setActiveTab('listings')} 
          style={tabStyle(activeTab === 'listings')}
        >
          <Building size={18} />
          My Listings
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'interests' && (
          <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
            <ReceivedInterests />
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            {loading ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading your properties...</div>
            ) : listings.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {listings.map(listing => (
                  <div key={listing._id} style={{ position: 'relative' }}>
                    <ListingCard listing={listing} />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <Link 
                        to={`/listings/edit/${listing._id}`} 
                        style={{ flex: 1, textAlign: 'center', padding: '0.5rem', border: '1px solid var(--color-border)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text)', textDecoration: 'none' }}
                      >
                        Edit
                      </Link>
                      <button 
                        style={{ flex: 1, textAlign: 'center', padding: '0.5rem', border: '1px solid var(--color-danger)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, color: '#ef4444', cursor: 'pointer' }}
                        onClick={async () => {
                          if (window.confirm('Are you sure you want to delete this listing?')) {
                            try {
                              // Call delete listing API
                              // For now we just refresh the tab
                              setActiveTab('interests');
                              setTimeout(() => setActiveTab('listings'), 100);
                            } catch (err) {}
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: 'var(--color-surface)', padding: '4rem 2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)', textAlign: 'center' }}>
                <Home size={48} color="var(--color-text-muted)" style={{ margin: '0 auto 1rem auto' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Manage Properties</h2>
                <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
                  View and edit your posted listings. Your active listings will appear in the public search.
                </p>
                <Link 
                  to="/listings" 
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: 'var(--color-primary)', border: '1px solid var(--color-primary)', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                >
                  <Search size={18} />
                  View Public Listings
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
