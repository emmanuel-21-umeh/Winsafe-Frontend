import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AdminSubscriptions = () => {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/subscriptions/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSubs(res.data.subscriptions || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = subs.filter(s => s.status === 'active').length;
  const monthlyRevenue = activeCount * 500;

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Subscriptions</h1>
          <p className="text-secondary">Pro subscribers and revenue.</p>
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: 20 }}>
        <div className="stat-card card-accent">
          <p className="meta-label">Active Pro Users</p>
          <p className="stat-value">{activeCount}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Monthly Revenue</p>
          <p className="stat-value" style={{ color: '#00C853' }}>₦{monthlyRevenue.toLocaleString()}</p>
        </div>
      </div>

      {loading && <p className="text-secondary">Loading subscriptions...</p>}

      {!loading && subs.length === 0 && (
        <div className="card empty-card">No subscriptions yet.</div>
      )}

      {subs.map(sub => (
        <div className="card admin-row" key={sub.id}>
          <div>
            <p className="admin-row-title">{sub.phone_number}</p>
            <p className="text-secondary">Plan: {sub.plan}</p>
            <p className="text-secondary">
              Expires: {new Date(sub.expires_at).toLocaleDateString()}
            </p>
          </div>
          <span className={`badge ${sub.status === 'active' ? 'badge-success' : sub.status === 'cancelled' ? 'badge-danger' : 'badge-warning'}`}>
            {sub.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AdminSubscriptions;