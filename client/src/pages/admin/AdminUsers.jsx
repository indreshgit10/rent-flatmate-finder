import { useState, useEffect } from 'react';
import { getUsers, disableUser, enableUser } from '../../services/adminService';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers(1, 50); // Get first 50 users for simplicity
      if (res.data.success) {
        setUsers(res.data.data.users);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (user) => {
    if (user.role === 'admin') {
      alert('Cannot disable admin users');
      return;
    }

    const action = user.isDisabled ? 'enable' : 'disable';
    if (!window.confirm(`Are you sure you want to ${action} ${user.name}?`)) return;

    try {
      if (user.isDisabled) {
        await enableUser(user._id);
      } else {
        await disableUser(user._id);
      }
      
      // Update local state
      setUsers(users.map(u => 
        u._id === user._id ? { ...u, isDisabled: !u.isDisabled } : u
      ));
    } catch (err) {
      alert(err.response?.data?.message || `Failed to ${action} user`);
    }
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading users...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'var(--color-danger)' }}>{error}</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>User Management</h1>
      
      <div style={{ background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface-raised)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Name</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Email</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Role</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: 600 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No users found.</td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '1rem' }}>{user.name}</td>
                  <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{user.email}</td>
                  <td style={{ padding: '1rem', textTransform: 'capitalize' }}>{user.role}</td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ 
                      display: 'inline-block', 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      backgroundColor: user.isDisabled ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: user.isDisabled ? 'var(--color-danger)' : 'var(--color-success)'
                    }}>
                      {user.isDisabled ? 'Disabled' : 'Active'}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => toggleUserStatus(user)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          background: 'transparent',
                          border: `1px solid ${user.isDisabled ? 'var(--color-success)' : 'var(--color-danger)'}`,
                          color: user.isDisabled ? 'var(--color-success)' : 'var(--color-danger)',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: 500
                        }}
                      >
                        {user.isDisabled ? <><ShieldCheck size={16} /> Enable</> : <><ShieldAlert size={16} /> Disable</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
