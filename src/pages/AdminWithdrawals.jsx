import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  const fetchWithdrawals = () => {
    axios.get('http://127.0.0.1:5000/api/wallet/admin/all', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setWithdrawals(res.data.withdrawals || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load withdrawals'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const approve = async (id) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/wallet/admin/approve', 
        { withdrawal_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || 'Approval failed');
    }
  };

  const reject = async (id) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/wallet/admin/reject', 
        { withdrawal_id: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchWithdrawals();
    } catch (err) {
      alert(err.response?.data?.message || 'Rejection failed');
    }
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Withdrawals</h1>
          <p className="text-secondary">Approve or reject withdrawal requests.</p>
        </div>
      </div>

      {loading && <p className="text-secondary">Loading withdrawals...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && withdrawals.length === 0 && (
        <div className="card empty-card">No withdrawal requests.</div>
      )}

      <div className="admin-table-list">
        {withdrawals.map(withdrawal => (
          <div className="card admin-row" key={withdrawal.id}>
            <div>
              <p className="admin-row-title">{withdrawal.phone_number}</p>
              <p className="text-secondary">Amount: ₦{withdrawal.amount}</p>
              <p className="text-secondary">Status: {withdrawal.status}</p>
            </div>
            {withdrawal.status === 'pending' && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => approve(withdrawal.id)}>Approve</button>
                <button className="btn btn-danger btn-sm" onClick={() => reject(withdrawal.id)}>Reject</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminWithdrawals;