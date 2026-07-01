import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { register as registerApi } from '../services/authService';

const ROLE_DASHBOARDS = { tenant: '/dashboard/tenant', owner: '/dashboard/owner' };

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

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'tenant' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const { data } = await registerApi({ name: form.name, email: form.email, password: form.password, role: form.role });
      login(data.data.token);
      navigate(ROLE_DASHBOARDS[form.role] || '/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '3rem auto' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.4rem' }}>Create Account</h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.8rem' }}>
        Join as a tenant or room owner.
      </p>

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
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Full Name</label>
          <input id="register-name" name="name" value={form.name} onChange={handleChange} required style={inputStyle} placeholder="Jane Doe" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Email</label>
          <input id="register-email" type="email" name="email" value={form.email} onChange={handleChange} required style={inputStyle} placeholder="you@example.com" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Password</label>
          <input id="register-password" type="password" name="password" value={form.password} onChange={handleChange} required minLength={8} style={inputStyle} placeholder="Min 8 characters" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Confirm Password</label>
          <input id="register-confirm" type="password" name="confirm" value={form.confirm} onChange={handleChange} required style={inputStyle} placeholder="Repeat password" />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>I am a</label>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['tenant', 'owner'].map((r) => (
              <label key={r} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.5rem 1.2rem',
                borderRadius: '6px',
                border: `1px solid ${form.role === r ? 'var(--color-primary)' : 'var(--color-border)'}`,
                background: form.role === r ? 'rgba(99,102,241,0.15)' : 'var(--color-surface-raised)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: '0.9rem',
                transition: 'all 0.15s',
              }}>
                <input id={`role-${r}`} type="radio" name="role" value={r} checked={form.role === r} onChange={handleChange} style={{ accentColor: 'var(--color-primary)' }} />
                {r}
              </label>
            ))}
          </div>
        </div>

        <button
          id="register-submit"
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
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <p style={{ marginTop: '1.2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
