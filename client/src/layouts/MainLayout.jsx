import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = ({ user, onLogout }) => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: 'background-color 0.3s ease' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ 
        flex: 1, 
        padding: isDashboard ? '0' : '2rem', 
        maxWidth: isDashboard ? '100%' : 'var(--max-width)', 
        margin: '0 auto', 
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
