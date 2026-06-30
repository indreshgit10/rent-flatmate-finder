import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = ({ user, onLogout }) => {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar user={user} onLogout={onLogout} />
      <main style={{ flex: 1, padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
