import { Link } from 'react-router-dom';

const Unauthorized = () => (
  <div style={{ textAlign: 'center', marginTop: '5rem' }}>
    <h1 style={{ fontSize: '5rem', fontWeight: 700, color: 'var(--color-danger)', marginBottom: '0.5rem' }}>403</h1>
    <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
      You do not have permission to view this page.
    </p>
    <Link to="/" style={{
      background: 'var(--color-surface-raised)',
      color: 'var(--color-text)',
      padding: '0.6rem 1.4rem',
      borderRadius: '6px',
      fontWeight: 600,
      border: '1px solid var(--color-border)',
    }}>
      Back to Home
    </Link>
  </div>
);

export default Unauthorized;
