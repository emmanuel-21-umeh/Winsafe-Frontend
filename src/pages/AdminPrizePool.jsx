import { useState, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AdminPrizePool = () => {
  const [pools, setPools] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [period, setPeriod] = useState('daily');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = localStorage.getItem('token');

  const fetchPools = () => {
    axios.get('http://127.0.0.1:5000/api/prize-pool/today')
      .then(res => setPools(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load prize pools'));
  };

  useEffect(() => {
    fetchPools();
  }, []);

  const addFunds = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Enter a valid amount');
      return;
    }

    try {
      await axios.post('http://127.0.0.1:5000/api/prize-pool/add', {
        period,
        amount: amountNum,
        source: 'admin'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`Added ₦${amountNum} to ${period} pool`);
      setAmount('');
      fetchPools();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add funds');
    }
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Prize Pools</h1>
          <p className="text-secondary">Fund and manage daily, weekly, and monthly pools.</p>
        </div>
      </div>

      <div className="grid-3">
        <div className="stat-card card-accent">
          <p className="meta-label">Daily Pool</p>
          <p className="stat-value" style={{ color: '#00C853' }}>₦{pools.daily.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Weekly Pool</p>
          <p className="stat-value" style={{ color: '#00C853' }}>₦{pools.weekly.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Monthly Pool</p>
          <p className="stat-value" style={{ color: '#00C853' }}>₦{pools.monthly.toLocaleString()}</p>
        </div>
      </div>

      <div className="card">
        <h3>Add Funds</h3>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={addFunds}>
          <label className="input-label">Pool</label>
          <select
            className="input"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          <label className="input-label">Amount (₦)</label>
          <input
            type="number"
            className="input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
          />

          <button type="submit" className="btn btn-primary">Add to Prize Pool</button>
        </form>
      </div>
    </div>
  );
};

export default AdminPrizePool;