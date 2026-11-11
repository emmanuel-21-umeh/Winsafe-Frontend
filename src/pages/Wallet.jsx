import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const [walletRes, withdrawalsRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/wallet', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://127.0.0.1:5000/api/wallet/withdrawals', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setWallet(walletRes.data);
        setWithdrawals(withdrawalsRes.data.withdrawals || []);
      } catch (err) {
        setError('Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const amountNum = Number(amount);
    if (!amountNum || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/wallet/withdraw', {
        amount: amountNum
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Withdrawal request created');
      setWallet(prev => ({ ...prev, wallet_balance: res.data.remaining_balance }));
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal failed');
    }
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Wallet</h1>
          <p className="text-secondary">Manage your balance and withdrawals.</p>
        </div>
      </div>

      {loading && <p className="text-secondary">Loading wallet...</p>}

      {!loading && (
        <>
          <div className="wallet-balance-card">
            <p className="meta-label">AVAILABLE BALANCE</p>
            <h2 className="wallet-balance-value">₦{wallet?.wallet_balance?.toLocaleString() ?? 0}</h2>
            <p className="text-secondary">Daily Points: {wallet?.daily_points ?? 0}</p>
          </div>

          <div className="card">
            <h3>Request Withdrawal</h3>
            <p className="text-secondary" style={{ marginTop: 4 }}>Enter the amount you want to withdraw.</p>

            <form onSubmit={handleWithdraw}>
              <input
                type="number"
                className="input"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
              />

              {error && <p className="error-text">{error}</p>}
              {message && <p className="success-text">{message}</p>}

              <button type="submit" className="btn btn-primary">Request Withdrawal</button>
            </form>
          </div>

          <div className="section-heading">
            <h2>Withdrawal History</h2>
          </div>

          {withdrawals.length === 0 && (
            <div className="card empty-card">No withdrawals yet.</div>
          )}

          <div className="withdrawal-list">
            {withdrawals.map(withdrawal => (
              <div className="card withdrawal-card" key={withdrawal.id}>
                <div>
                  <p className="withdrawal-amount">₦{withdrawal.amount.toLocaleString()}</p>
                  <p className="text-secondary">{new Date(withdrawal.created_at).toLocaleString()}</p>
                </div>
                <span className={`badge ${withdrawal.status === 'approved' ? 'badge-success' : withdrawal.status === 'rejected' ? 'badge-danger' : 'badge-warning'}`}>
                  {withdrawal.status}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;