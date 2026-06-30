const Home = () => {
  return (
    <div style={{
      maxWidth: '800px',
      margin: '4rem auto',
      textAlign: 'center',
    }}>
      <h1 style={{
        fontSize: '3rem',
        fontWeight: 700,
        background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
      }}>
        Find Your Perfect Room and Flatmate
      </h1>
      <p style={{
        fontSize: '1.15rem',
        color: 'var(--color-text-muted)',
        lineHeight: 1.8,
        marginBottom: '2.5rem',
      }}>
        AI-powered compatibility matching connects tenants and room owners based on
        budget, location, and lifestyle. Real conversations start after a genuine match.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="/listings"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            transition: 'opacity 0.2s',
          }}
        >
          Browse Listings
        </a>
        <a
          href="/register"
          style={{
            background: 'var(--color-surface-raised)',
            color: 'var(--color-text)',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '1rem',
            border: '1px solid var(--color-border)',
          }}
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Home;
