import { Link, useNavigate } from 'react-router-dom';

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
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ color: 'var(--color-text)', fontSize: '1.2rem', fontWeight: 700 }}>
        RentMatch
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link to="/listings">Browse Listings</Link>

        {user ? (
          <>
            {user.role === 'owner' && <Link to="/dashboard/owner">Dashboard</Link>}
            {user.role === 'tenant' && <Link to="/dashboard/tenant">Dashboard</Link>}
            {user.role === 'admin' && <Link to="/dashboard/admin">Admin</Link>}
            <button
              onClick={handleLogout}
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '0.9rem',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link
              to="/register"
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                borderRadius: '6px',
                padding: '0.4rem 1rem',
              }}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
