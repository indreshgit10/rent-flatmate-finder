import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import { Home, LayoutDashboard, LogOut, UserPlus, LogIn, Building, Menu, X } from 'lucide-react';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;
  const close = () => setMenuOpen(false);

  const dashboardPath =
    user?.role === 'owner' ? '/dashboard/owner' :
    user?.role === 'tenant' ? '/dashboard/tenant' :
    user?.role === 'admin' ? '/dashboard/admin' : null;

  const linkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontWeight: 600,
    color: active ? 'var(--color-primary)' : 'var(--color-text)',
    transition: 'color 0.2s',
    textDecoration: 'none',
  });

  return (
    <>
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
        {/* Logo */}
        <Link to="/" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', textDecoration: 'none' }}>
          <Home size={24} />
          FlatMate
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link to="/listings" style={linkStyle(isActive('/listings'))}>
            <Building size={18} />
            Listings
          </Link>

          {user ? (
            <>
              {dashboardPath && (
                <Link to={dashboardPath} style={linkStyle(location.pathname.includes('/dashboard'))}>
                  <LayoutDashboard size={18} />
                  {user.role === 'admin' ? 'Admin' : 'Dashboard'}
                </Link>
              )}
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.4rem',
                  background: 'transparent', color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                  padding: '0.4rem 1rem', cursor: 'pointer', fontFamily: 'inherit',
                  fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-text)'; e.currentTarget.style.borderColor = 'var(--color-text-muted)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-muted)'; e.currentTarget.style.borderColor = 'var(--color-border)'; }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle(isActive('/login'))}>
                <LogIn size={18} /> Log in
              </Link>
              <Link
                to="/register"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-primary)', color: '#ffffff', borderRadius: 'var(--radius-md)', padding: '0.5rem 1.25rem', fontWeight: 600, transition: 'background-color 0.2s', textDecoration: 'none' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
              >
                <UserPlus size={18} /> Sign up
              </Link>
            </>
          )}

          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--color-border)', margin: '0 0.5rem' }}></div>
          <ThemeToggle />
        </div>

        {/* Mobile Right: theme toggle + hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="hamburger-btn">
            <ThemeToggle />
          </div>
          <button
            className="hamburger-btn"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <Link to="/listings" style={linkStyle(isActive('/listings'))} onClick={close}>
          <Building size={18} /> Listings
        </Link>

        {user ? (
          <>
            {dashboardPath && (
              <Link to={dashboardPath} style={linkStyle(location.pathname.includes('/dashboard'))} onClick={close}>
                <LayoutDashboard size={18} /> {user.role === 'admin' ? 'Admin' : 'Dashboard'}
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--color-danger)', border: '1px solid var(--color-danger)', borderRadius: 'var(--radius-md)', padding: '0.6rem 1rem', fontFamily: 'inherit', fontSize: '1rem', fontWeight: 600, cursor: 'pointer', width: '100%' }}
            >
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={linkStyle(isActive('/login'))} onClick={close}>
              <LogIn size={18} /> Log in
            </Link>
            <Link to="/register" onClick={close} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--color-primary)', color: '#ffffff', borderRadius: 'var(--radius-md)', padding: '0.65rem 1.25rem', fontWeight: 600, textDecoration: 'none', width: 'fit-content' }}>
              <UserPlus size={18} /> Sign up
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
