import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

const Admin = () => {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:5000/api/admin/summary', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSummary(res.data.summary))
      .catch(err => setError(err.response?.data?.message || 'Failed to load summary'));
  }, []);

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-secondary">Platform overview and management.</p>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {summary ? (
        <div className="grid-4">
          <div className="stat-card">
            <p className="meta-label">Total Users</p>
            <p className="stat-value">{summary.total_users}</p>
          </div>
          <div className="stat-card">
            <p className="meta-label">Predictions</p>
            <p className="stat-value">{summary.total_predictions}</p>
          </div>
          <div className="stat-card">
            <p className="meta-label">Prize Pool</p>
            <p className="stat-value">₦{summary.total_prize_pool.toLocaleString()}</p>
          </div>
        </div>
      ) : (
        <p className="text-secondary">Loading summary...</p>
      )}

      <div className="admin-nav-grid">
        <Link to="/admin/events" className="card admin-nav-card">
          <h3>Manage Events</h3>
          <p>Create, update, or delete prediction events.</p>
        </Link>
        <Link to="/admin/users" className="card admin-nav-card">
          <h3>View Users</h3>
          <p>Manage platform users.</p>
        </Link>
        <Link to="/admin/withdrawals" className="card admin-nav-card">
          <h3>Withdrawals</h3>
          <p>Approve or reject withdrawal requests.</p>
        </Link>
        <Link to="/admin/prize-pool" className="card admin-nav-card">
          <h3>Prize Pool</h3>
          <p>Fund and manage the prize pool.</p>
        </Link>
        <Link to="/admin/sponsors" className="card admin-nav-card">
          <h3>Sponsors</h3>
          <p>Manage brand sponsorships.</p>
        </Link>
        <Link to="/admin/payouts" className="card admin-nav-card">
          <h3>Payouts</h3>
          <p>Distribute prizes to top 100 users.</p>
        </Link>
        <Link to="/admin/sessions" className="card admin-nav-card">
          <h3>Sessions</h3>
          <p>View top users by time spent.</p>
        </Link>
        <Link to="/admin/subscriptions" className="card admin-nav-card">
          <h3>Subscriptions</h3>
          <p>View Pro subscribers and revenue.</p>
        </Link>
      </div>
    </div>
  );
};

export default Admin;