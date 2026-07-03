const Home = () => {
  return (
    <div style={{
      maxWidth: '900px',
      margin: '6rem auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '2rem'
    }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: 800,
        letterSpacing: '-1px',
        lineHeight: 1.1,
        background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '1rem',
      }}>
        Find Your Perfect Room <br /> and Flatmate
      </h1>
      <p style={{
        fontSize: '1.25rem',
        color: 'var(--color-text-muted)',
        lineHeight: 1.8,
        maxWidth: '700px',
        marginBottom: '1.5rem',
      }}>
        AI-powered compatibility matching connects tenants and room owners based on
        budget, location, and lifestyle. Real conversations start after a genuine match.
      </p>
      
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <a
          href="/listings"
          style={{
            background: 'var(--color-primary)',
            color: '#ffffff',
            padding: '1rem 2.5rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: '1.1rem',
            transition: 'background-color 0.2s, transform 0.2s',
            boxShadow: '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-primary)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Browse Listings
        </a>
        <a
          href="/register"
          style={{
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            padding: '1rem 2.5rem',
            borderRadius: 'var(--radius-full)',
            fontWeight: 600,
            fontSize: '1.1rem',
            border: '1px solid var(--color-border)',
            transition: 'all 0.2s',
            boxShadow: 'var(--shadow-sm)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-surface)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Get Started
        </a>
      </div>
    </div>
  );
};

export default Home;
