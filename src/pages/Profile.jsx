import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Profile</h1>
          <p className="text-secondary">Your account information.</p>
        </div>
      </div>

      <div className="profile-header">
        <div className="profile-avatar">
          {user?.phone_number?.charAt(0) || 'W'}
        </div>
        <div>
          <p className="profile-phone">{user?.phone_number || 'Not available'}</p>
          <p className="text-secondary">WinSafe Member</p>
        </div>
      </div>

      <div className="grid-3">
        <div className="stat-card">
          <p className="meta-label">Daily Points</p>
          <p className="stat-value">{user?.daily_points ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Wallet Balance</p>
          <p className="stat-value">₦{user?.wallet_balance ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Predictions</p>
          <p className="stat-value">0</p>
        </div>
      </div>

      <div className="card">
        <h3>Account Details</h3>
        <div className="detail-row">
          <p className="text-secondary">Phone Number</p>
          <p>{user?.phone_number || 'Not available'}</p>
        </div>
        <div className="detail-row">
          <p className="text-secondary">Role</p>
          <p>{user?.role || 'user'}</p>
        </div>
      </div>

      <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;