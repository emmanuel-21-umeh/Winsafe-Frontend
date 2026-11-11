import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchUsers = () => {
    axios.get('http://127.0.0.1:5000/api/admin/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUsers(res.data.users || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load users'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => {
    return user.phone_number?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDelete = async (userId) => {
    if (!window.confirm('Delete this user? This cannot be undone.')) return;

    try {
      await axios.post('http://127.0.0.1:5000/api/admin/users/delete', 
        { user_id: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Users</h1>
          <p className="text-secondary">Search and manage platform users.</p>
        </div>
      </div>

      <input
        className="input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by phone number..."
      />

      {loading && <p className="text-secondary">Loading users...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && filteredUsers.length === 0 && (
        <div className="card empty-card">No users found.</div>
      )}

      <div className="admin-table-list">
        {filteredUsers.map(user => (
          <div className="card admin-row" key={user.id}>
            <div>
              <p className="admin-row-title">{user.phone_number}</p>
              <p className="text-secondary">Points: {user.daily_points} • Wallet: ₦{user.wallet_balance}</p>
              <p className="text-secondary">Role: {user.role}</p>
            </div>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;