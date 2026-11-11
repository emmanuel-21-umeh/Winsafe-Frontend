import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AdminSessions = () => {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/sessions/top-users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data.users))
      .catch(err => console.error(err));
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Session Time</h1>
          <p className="text-secondary">Top users by time spent on WinSafe.</p>
        </div>
      </div>

      {users.length === 0 && <div className="card empty-card">No session data yet.</div>}

      {users.map((u, i) => (
        <div className="card admin-row" key={u.id}>
          <div>
            <p className="admin-row-title">#{i + 1} — {u.phone_number}</p>
          </div>
          <p style={{ color: '#00C853', fontWeight: 700 }}>{formatTime(u.total_seconds)}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminSessions;