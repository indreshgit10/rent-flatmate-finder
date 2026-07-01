import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';

const AppRoutes = () => {
  const { user, logout } = useAuth();
  return (
    <Routes>
      <Route element={<MainLayout user={user} onLogout={logout} />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/listings/:id" element={<ListingDetail />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route
          path="/dashboard/tenant"
          element={
            <PrivateRoute allowedRoles={['tenant']}>
              <div style={{ color: 'var(--color-text-muted)' }}>Tenant Dashboard -- coming soon</div>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/owner"
          element={
            <PrivateRoute allowedRoles={['owner']}>
              <div style={{ color: 'var(--color-text-muted)' }}>Owner Dashboard -- coming soon</div>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute allowedRoles={['admin']}>
              <div style={{ color: 'var(--color-text-muted)' }}>Admin Dashboard -- coming soon</div>
            </PrivateRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
