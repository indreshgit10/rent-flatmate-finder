import { ArrowRight, Search, UserCheck, MessageSquare, MapPin, Handshake, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      width: '100%',
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)',
      fontFamily: 'Inter, sans-serif',
      paddingBottom: '4rem'
    }}>
      
      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '6rem auto 4rem', textAlign: 'center', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '4.5rem', fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.1, marginBottom: '1.5rem' }}>
          Find your next flatmate, <br />
          <span style={{ color: 'var(--color-primary)' }}>WITH EASE.</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          Stop scrolling endlessly. Our compatibility matching connects tenants and property owners based on budget, location, and lifestyle.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button onClick={() => navigate('/listings')} style={{ background: 'var(--color-primary)', color: '#fff', border: 'none', padding: '1rem 2.5rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color 0.2s' }}>
            Browse Listings <Search size={18} />
          </button>
          <button onClick={() => navigate('/register')} style={{ background: 'transparent', color: 'var(--color-text)', border: '1px solid var(--color-border)', padding: '1rem 2.5rem', borderRadius: '999px', fontSize: '1.1rem', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'background-color 0.2s' }}>
            Get Started
          </button>
        </div>
      </section>

      {/* Latest from RentMatch Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {/* Card 1 */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '1.5rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
            onClick={() => navigate('/listings')}
          >
            <div style={{ width: '220px', height: '140px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/images/society.png" alt="Modern Society" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Discover Premium Flats</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Browse verified listings in top residential societies. Find the perfect flatmate with our matching algorithm.
              </p>
              <div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-text)', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '1rem', display: 'flex', gap: '1.5rem', cursor: 'pointer', transition: 'background-color 0.2s' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-raised)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
            onClick={() => navigate('/register')}
          >
            <div style={{ width: '220px', height: '140px', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/images/man_working.png" alt="Owner Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Manage Your Properties</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                Track interest requests, review potential tenants, and monitor your property portfolio all in one place.
              </p>
              <div>
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-text)', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer' }}>
                  Read More <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '4rem 2rem', borderTop: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '4rem' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <UserCheck size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>1. Create Profile</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>Tell us about your lifestyle, budget, and location preferences.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <Handshake size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>2. AI Matching</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>Our algorithm finds the highest compatibility scores for you.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--color-surface)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)' }}>
              <MessageSquare size={32} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>3. Connect</h3>
            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>Chat securely, arrange a viewing, and finalize your new home.</p>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section style={{ maxWidth: '1200px', margin: '4rem auto', padding: '4rem 2rem', background: 'var(--color-surface)', borderRadius: '16px', border: '1px solid var(--color-border)' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '3rem', textAlign: 'center' }}>Why choose RentMatch?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
          {[
            { icon: <MapPin size={24} />, title: 'Location First', desc: 'Find places exactly where you want to live with precision mapping.' },
            { icon: <Handshake size={24} />, title: 'Genuine Matches', desc: 'AI scores ensure you share the same vibe and lifestyle habits.' },
            { icon: <ShieldCheck size={24} />, title: 'Secure Chat', desc: 'Communicate safely within the platform without sharing phone numbers.' },
          ].map((f, i) => (
            <div key={i} style={{ padding: '2rem', border: '1px solid var(--color-border)', borderRadius: '12px', background: 'var(--color-background)', transition: 'transform 0.2s', cursor: 'default' }}
                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>{f.icon}</div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{f.title}</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grow Your Network Section (Moved to Bottom) */}
      <section style={{ maxWidth: '1200px', margin: '8rem auto 4rem', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '4rem' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
            Grow your<br />network
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '2.5rem', maxWidth: '90%' }}>
            Fuel your community growth while protecting the rental experience. 
            Design a living arrangement that feels like a natural extension of your lifestyle. 
            RentMatch offers the flexibility to optimize for long-term compatibility using our wide range of matching tools.
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <button 
              onClick={() => navigate('/register')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-text)', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              List with RentMatch <ArrowRight size={16} />
            </button>
            <button 
              onClick={() => navigate('/listings')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', background: 'transparent', border: 'none', color: 'var(--color-text)', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text)'}
            >
              Learn More <ArrowRight size={16} />
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1.2, position: 'relative' }}>
          <div style={{ 
            background: 'var(--color-surface)', 
            border: '1px solid var(--color-border)', 
            borderRadius: '12px', 
            padding: '1.5rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <img src="/images/group_talking.png" alt="Group of friends talking" style={{ width: '100%', borderRadius: '8px', display: 'block' }} />
          </div>
          

        </div>
      </section>
    </div>
  );
};

export default Home;
