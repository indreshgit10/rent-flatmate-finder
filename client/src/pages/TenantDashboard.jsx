import { Link } from 'react-router-dom';
import { Home, User, Search } from 'lucide-react';
import SentInterests from './SentInterests';

const TenantDashboard = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-text)', letterSpacing: '-0.5px' }}>Tenant Dashboard</h1>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>Track your interest requests and find your next home.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link 
            to="/profile" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface)' }}
          >
            <User size={18} />
            My Profile
          </Link>
          <Link 
            to="/listings" 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.25rem', backgroundColor: 'var(--color-primary)', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)' }}
          >
            <Search size={18} />
            Browse Listings
          </Link>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ padding: '0.75rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderRadius: '8px' }}>
            <Home size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>My Sent Requests</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Status of your housing applications</p>
          </div>
        </div>

        {/* Render the existing SentInterests component directly inside the dashboard */}
        <SentInterests />
      </div>
    </div>
  );
};

export default TenantDashboard;
