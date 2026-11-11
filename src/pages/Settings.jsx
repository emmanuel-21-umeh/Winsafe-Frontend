import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Settings = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [sound, setSound] = useState(false);
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Settings</h1>
          <p className="text-secondary">Manage your account and preferences.</p>
        </div>
      </div>

      {message && <p className="success-text">{message}</p>}

      <div className="section-heading">
        <h2>Preferences</h2>
      </div>
      <div className="card">
        <div className="setting-row">
          <div>
            <p className="setting-label">Notifications</p>
            <p className="text-secondary">Alerts for events, results, and rewards.</p>
          </div>
          <button
            type="button"
            className={`toggle-switch ${notifications ? 'active' : ''}`}
            onClick={() => setNotifications(!notifications)}
          >
            <span className="toggle-knob" />
          </button>
        </div>

        <div className="setting-row">
          <div>
            <p className="setting-label">Sound</p>
            <p className="text-secondary">Play sounds for important updates.</p>
          </div>
          <button
            type="button"
            className={`toggle-switch ${sound ? 'active' : ''}`}
            onClick={() => setSound(!sound)}
          >
            <span className="toggle-knob" />
          </button>
        </div>
      </div>

      <div className="section-heading">
        <h2>Account</h2>
      </div>
      <div className="card">
        <div className="setting-row">
          <div>
            <p className="setting-label">Phone Number</p>
            <p className="text-secondary">{user.phone_number || 'Not available'}</p>
          </div>
          <span className="badge badge-accent">Verified</span>
        </div>
        <div className="setting-row">
          <div>
            <p className="setting-label">Role</p>
            <p className="text-secondary">{user.role || 'user'}</p>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <h2>Referral</h2>
      </div>
      <div className="card">
        <div className="setting-row">
          <div>
            <p className="setting-label">Your Referral ID</p>
            <p className="text-secondary">Share this ID to earn bonus points.</p>
          </div>
          <div className="referral-code">{user.id || 'N/A'}</div>
        </div>
      </div>

      <div className="section-heading">
        <h2>Security</h2>
      </div>
      <div className="card">
        <button className="btn btn-secondary" onClick={() => showMessage('Password change coming soon')}>
          Change Password
        </button>
      </div>

      <div className="section-heading">
        <h2>Help & Support</h2>
      </div>
      <div className="card">
        <button className="setting-link-row" onClick={() => showMessage('FAQ coming soon')}>
          <span>FAQ</span>
          <span className="text-secondary">›</span>
        </button>
        <button className="setting-link-row" onClick={() => showMessage('Contact support coming soon')}>
          <span>Contact Support</span>
          <span className="text-secondary">›</span>
        </button>
        <button className="setting-link-row" onClick={() => showMessage('Privacy Policy coming soon')}>
          <span>Privacy Policy</span>
          <span className="text-secondary">›</span>
        </button>
        <button className="setting-link-row" onClick={() => showMessage('Terms of Service coming soon')}>
          <span>Terms of Service</span>
          <span className="text-secondary">›</span>
        </button>
      </div>

      <div className="section-heading">
        <h2>Danger Zone</h2>
      </div>
      <div className="card">
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <p className="text-secondary" style={{ textAlign: 'center', marginTop: 10 }}>WinSafe v1.0.0</p>
    </div>
  );
};

export default Settings;