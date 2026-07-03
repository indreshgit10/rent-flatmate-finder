import { Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav style={{
      background: 'var(--color-surface)',
      borderBottom: '1px solid var(--color-border)',
      padding: '0 2rem',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      transition: 'background-color 0.3s ease, border-color 0.3s ease'
    }}>
      <Link to="/" style={{ color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
        RentMatch
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/listings" style={{ fontWeight: 500, color: 'var(--color-text)' }}>Listings</Link>

        {user ? (
          <>
            {user.role === 'owner' && <Link to="/dashboard/owner" style={{ fontWeight: 500, color: 'var(--color-text)' }}>Dashboard</Link>}
            {user.role === 'tenant' && <Link to="/dashboard/tenant" style={{ fontWeight: 500, color: 'var(--color-text)' }}>Dashboard</Link>}
            {user.role === 'admin' && <Link to="/dashboard/admin" style={{ fontWeight: 500, color: 'var(--color-text)' }}>Admin</Link>}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                color: 'var(--color-text-muted)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text)';
                e.currentTarget.style.borderColor = 'var(--color-text-muted)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
                e.currentTarget.style.borderColor = 'var(--color-border)';
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontWeight: 500, color: 'var(--color-text)' }}>Log in</Link>
            <Link
              to="/register"
              style={{
                background: 'var(--color-primary)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                padding: '0.5rem 1.25rem',
                fontWeight: 600,
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              Sign up
            </Link>
          </>
        )}
        <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 0.5rem' }}></div>
        <ThemeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
