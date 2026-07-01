import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import useAuth from './hooks/useAuth';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Register from './pages/Register';

const AppRoutes = () => {
  const { user, logout } = useAuth();
  return (
    <Routes>
      <Route element={<MainLayout user={user} onLogout={logout} />}>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
