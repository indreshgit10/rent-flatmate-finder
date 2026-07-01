import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { login as loginApi } from '../services/authService';

const ROLE_DASHBOARDS = { tenant: '/dashboard/tenant', owner: '/dashboard/owner', admin: '/dashboard/admin' };

const inputStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  background: 'var(--color-surface-raised)',
  border: '1px solid var(--color-border)',
  borderRadius: '6px',
  color: 'var(--color-text)',
  fontSize: '0.95rem',
  outline: 'none',
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginApi(form);
      login(data.data.token);
      navigate(ROLE_DASHBOARDS[data.data.user.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '3rem auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>Welcome back</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.8rem' }}>Sign in to your account.</p>

      {error && (
        <div style={{
          background: '#3b1219',
          border: '1px solid var(--color-danger)',
          color: '#fca5a5',
          padding: '0.65rem 0.85rem',
          borderRadius: '6px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email</label>
          <input id="login-email" type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Password</label>
          <input id="login-password" type="password" name="password" value={form.password} onChange={handleChange} required style={inputStyle} placeholder="Your password" />
        </div>

        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          style={{
            marginTop: '0.5rem',
            padding: '0.75rem',
            background: loading ? 'var(--color-surface-raised)' : 'var(--color-primary)',
            color: loading ? 'var(--color-text-muted)' : '#fff',
            border: 'none',
            borderRadius: '6px',
            fontFamily: 'inherit',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {loading ? 'Signing in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1.2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        No account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
