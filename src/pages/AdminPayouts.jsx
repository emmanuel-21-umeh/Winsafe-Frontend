import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AdminPayouts = () => {
  const [period, setPeriod] = useState('daily');
  const [preview, setPreview] = useState(null);
  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchHistory = () => {
    axios.get('http://127.0.0.1:5000/api/payouts/history', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setHistory(res.data.logs))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const previewPayouts = async () => {
    setMessage('');
    setError('');
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/payouts/preview/${period}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPreview(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Preview failed');
    }
  };

  const executePayouts = async () => {
    if (!window.confirm('Execute payouts for this period?')) return;
    setMessage('');
    setError('');
    try {
      const res = await axios.post(`http://127.0.0.1:5000/api/payouts/execute/${period}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Paid ₦${res.data.total_paid} to ${res.data.winners} users`);
      setPreview(null);
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Execution failed');
    }
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Payouts</h1>
          <p className="text-secondary">Preview and execute prize distributions.</p>
        </div>
      </div>

      {message && <p className="success-text">{message}</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="card">
        <h3>Select Period</h3>
        <div className="filter-row" style={{ marginTop: 12 }}>
          {['daily', 'weekly', 'monthly'].map(p => (
            <button
              key={p}
              className={`chip ${period === p ? 'active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <button className="btn btn-secondary" onClick={previewPayouts} style={{ marginTop: 12 }}>
          Preview Payouts
        </button>
      </div>

      {preview && (
        <div className="card">
          <h3>Preview — {preview.period}</h3>
          <p className="text-secondary">Pool: ₦{preview.pool.toLocaleString()}</p>
          <p className="text-secondary">Total to distribute: ₦{preview.total_distributed?.toLocaleString() || 0}</p>

          <div style={{ marginTop: 12 }}>
            {preview.payouts.length === 0 && <p className="text-secondary">No eligible winners.</p>}
            {preview.payouts.map(p => (
              <div className="admin-row" key={p.user_id} style={{ padding: '8px 0', borderBottom: '1px solid #20262D' }}>
                <div>
                  <p className="admin-row-title">#{p.rank} — {p.phone_number}</p>
                </div>
                <p style={{ color: '#00C853', fontWeight: 700 }}>₦{p.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {preview.payouts.length > 0 && (
            <button className="btn btn-primary" onClick={executePayouts} style={{ marginTop: 16 }}>
              Execute Payouts
            </button>
          )}
        </div>
      )}

      <div className="section-heading">
        <h2>Payout History</h2>
      </div>

      {history.length === 0 && <div className="card empty-card">No payouts executed yet.</div>}

      {history.map(log => (
        <div className="card admin-row" key={log.id}>
          <div>
            <p className="admin-row-title">{log.period.toUpperCase()} — {log.pool_date}</p>
            <p className="text-secondary">Winners: {log.winners}</p>
          </div>
          <p style={{ color: '#00C853', fontWeight: 700 }}>₦{log.total_paid.toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminPayouts;