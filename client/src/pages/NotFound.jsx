import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '5rem' }}>
    <h1 style={{ fontSize: '5rem', fontWeight: 700, color: 'var(--color-primary)', marginBottom: '0.5rem' }}>404</h1>
    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
      The page you are looking for does not exist.
    </p>
    <Link to="/" style={{
      background: 'var(--color-primary)',
      color: '#fff',
      padding: '0.6rem 1.4rem',
      borderRadius: '6px',
      fontWeight: 600,
    }}>
      Back to Home
    </Link>
  </div>
);

export default NotFound;
