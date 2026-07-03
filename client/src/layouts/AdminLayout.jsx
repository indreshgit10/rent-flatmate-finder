import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Users, Home as HomeIcon, BarChart3, LogOut, Settings } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navStyle = ({ isActive }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.875rem',
    padding: '0.875rem 1.25rem',
    borderRadius: '12px',
    color: isActive ? '#fff' : 'var(--color-text-muted)',
    backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
    fontWeight: isActive ? 600 : 500,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    marginBottom: '0.5rem',
    textDecoration: 'none',
  });

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', backgroundColor: 'var(--color-bg)' }}>
      {/* Modern Sidebar */}
      <aside style={{ 
        width: '280px', 
        borderRight: '1px solid var(--color-border)', 
        padding: '2rem 1.5rem',
        backgroundColor: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ marginBottom: '3rem', paddingLeft: '0.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--color-text)' }}>
            Admin <span style={{ color: 'var(--color-primary)' }}>Panel</span>
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
            Manage platform resources
          </p>
        </div>

        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <NavLink 
            to="/dashboard/admin/users" 
            style={navStyle}
            onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'; }}
            onMouseLeave={(e) => { if (e.currentTarget.style.backgroundColor === 'var(--color-surface-raised)') e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Users size={20} />
            Users
          </NavLink>
          <NavLink 
            to="/dashboard/admin/listings" 
            style={navStyle}
            onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'; }}
            onMouseLeave={(e) => { if (e.currentTarget.style.backgroundColor === 'var(--color-surface-raised)') e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <HomeIcon size={20} />
            Listings
          </NavLink>
          <NavLink 
            to="/dashboard/admin/stats" 
            style={navStyle}
            onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'; }}
            onMouseLeave={(e) => { if (e.currentTarget.style.backgroundColor === 'var(--color-surface-raised)') e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <BarChart3 size={20} />
            Platform Stats
          </NavLink>
        </nav>

        {/* Bottom Section */}
        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <NavLink 
            to="/dashboard/admin/settings"
            style={({ isActive }) => ({ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderRadius: '12px', color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)', backgroundColor: isActive ? 'var(--color-surface-raised)' : 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, transition: 'all 0.2s', textAlign: 'left', width: '100%', textDecoration: 'none' })}
            onMouseEnter={(e) => { if (!e.currentTarget.style.backgroundColor || e.currentTarget.style.backgroundColor === 'transparent') { e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'; e.currentTarget.style.color = 'var(--color-text)'; } }}
            onMouseLeave={(e) => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--color-text-muted)'; } }}
          >
            <Settings size={20} />
            Settings
          </NavLink>
          <button  
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.875rem 1.25rem', borderRadius: '12px', color: 'var(--color-danger)', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '3rem 4rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
