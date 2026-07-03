import { useState, useEffect } from 'react';
import { getPlatformStats } from '../../services/adminService';
import { Users, Home, Activity, MessageSquare, Handshake } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
    <div style={{ padding: '1rem', background: `${color}15`, color: color, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={32} />
    </div>
    <div>
      <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </p>
      <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.25rem', lineHeight: 1 }}>
        {value.toLocaleString()}
      </h3>
    </div>
  </div>
);

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getPlatformStats();
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch platform stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading platform statistics...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'var(--color-danger)' }}>{error}</div>;
  if (!stats) return null;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Platform Statistics</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="#3b82f6" 
        />
        <StatCard 
          title="Total Listings" 
          value={stats.totalListings} 
          icon={Home} 
          color="#8b5cf6" 
        />
        <StatCard 
          title="Active Listings" 
          value={stats.activeListings} 
          icon={Activity} 
          color="#22c55e" 
        />
        <StatCard 
          title="Interest Requests" 
          value={stats.totalInterests} 
          icon={Handshake} 
          color="#f59e0b" 
        />
        <StatCard 
          title="Messages Sent" 
          value={stats.totalMessages} 
          icon={MessageSquare} 
          color="#ec4899" 
        />
      </div>
    </div>
  );
};

export default AdminStats;
