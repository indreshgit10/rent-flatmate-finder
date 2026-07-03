import { useState } from 'react';
import { Save, Shield, Settings as SettingsIcon, Bell } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    autoApproveListings: false,
    maxListingsPerUser: 5,
    emailNotifications: true,
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Platform settings updated successfully!');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <SettingsIcon size={32} color="var(--color-primary)" />
          Platform Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
          Manage global application behavior and platform limits.
        </p>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Security & Access */}
        <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={20} color="var(--color-primary)" /> Security & Access
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>Maintenance Mode</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Disable public access to the platform during updates.</span>
              </div>
              <input 
                type="checkbox" 
                name="maintenanceMode" 
                checked={settings.maintenanceMode} 
                onChange={handleChange}
                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>Allow New Registrations</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Let new users sign up for tenant or owner accounts.</span>
              </div>
              <input 
                type="checkbox" 
                name="allowRegistrations" 
                checked={settings.allowRegistrations} 
                onChange={handleChange}
                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
              />
            </label>
          </div>
        </div>

        {/* Listing Configuration */}
        <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SettingsIcon size={20} color="var(--color-primary)" /> Listing Rules
          </h2>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
              <div>
                <span style={{ fontWeight: 600, display: 'block' }}>Auto-Approve Listings</span>
                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Automatically publish listings without manual admin review.</span>
              </div>
              <input 
                type="checkbox" 
                name="autoApproveListings" 
                checked={settings.autoApproveListings} 
                onChange={handleChange}
                style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600 }}>Max Active Listings per Owner</span>
              <input 
                type="number" 
                name="maxListingsPerUser" 
                value={settings.maxListingsPerUser} 
                onChange={handleChange}
                style={{ 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--color-border)',
                  background: 'var(--color-bg)',
                  color: 'var(--color-text)',
                  width: '100px'
                }}
              />
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div style={{ background: 'var(--color-surface)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--color-border)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--color-primary)" /> System Notifications
          </h2>
          
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <div>
              <span style={{ fontWeight: 600, display: 'block' }}>Admin Email Alerts</span>
              <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Receive emails when new users sign up or report issues.</span>
            </div>
            <input 
              type="checkbox" 
              name="emailNotifications" 
              checked={settings.emailNotifications} 
              onChange={handleChange}
              style={{ width: '1.25rem', height: '1.25rem', accentColor: 'var(--color-primary)' }}
            />
          </label>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem' }}>
          <button 
            type="submit" 
            disabled={saving}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.875rem 2rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'background-color 0.2s'
            }}
          >
            <Save size={18} />
            {saving ? 'Saving Changes...' : 'Save Settings'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AdminSettings;
