import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const Pro = () => {
  const [sub, setSub] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const fetchSub = () => {
    axios.get('http://127.0.0.1:5000/api/subscriptions/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setSub(res.data.subscription);
        setIsPro(res.data.is_pro);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSub();
  }, []);

  const handleSubscribe = async () => {
    try {
      await axios.post('http://127.0.0.1:5000/api/subscriptions/subscribe', { months: 1 }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Pro activated successfully');
      fetchSub();
    } catch (err) {
      setMessage('Failed to subscribe');
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel Pro?')) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/subscriptions/cancel', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Pro cancelled');
      fetchSub();
    } catch (err) {
      setMessage('Failed to cancel');
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <BackButton />
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>WinSafe Pro</h1>
          <p className="text-secondary">Unlock double points and exclusive benefits.</p>
        </div>
      </div>

      {message && <p className="success-text">{message}</p>}

      {/* Current Status */}
      <div className={`card ${isPro ? 'card-accent' : ''}`}>
        <p className="meta-label">CURRENT PLAN</p>
        <p className="stat-value" style={{ color: isPro ? '#00C853' : '#F4F7F5' }}>
          {isPro ? 'Pro' : 'Free'}
        </p>
        {isPro && sub?.expires_at && (
          <p className="text-secondary" style={{ marginTop: 6 }}>
            Renews on {new Date(sub.expires_at).toLocaleDateString()}
          </p>
        )}
        {!isPro && (
          <p className="text-secondary" style={{ marginTop: 6 }}>
            Upgrade to unlock all Pro features.
          </p>
        )}
      </div>

      {/* Pro Benefits */}
      <div className="card">
        <p className="meta-label">PRO BENEFITS</p>
        <ul style={{ marginTop: 12, paddingLeft: 18, color: '#9BA69F', lineHeight: 1.8 }}>
          <li>2× Daily Points (200 DP/day)</li>
          <li>2× rewarded ad rewards (20 DP per ad)</li>
          <li>Access to exclusive Pro events</li>
          <li>Priority withdrawals</li>
          <li>Pro badge on profile</li>
        </ul>
      </div>

      {/* Action */}
      <div className="card">
        {!isPro ? (
          <>
            <p className="meta-label">UPGRADE</p>
            <p className="stat-value">₦500 <span style={{ fontSize: '0.9rem', color: '#9BA69F' }}>/ month</span></p>
            <button className="btn btn-primary" onClick={handleSubscribe} style={{ marginTop: 12 }}>
              Upgrade to Pro
            </button>
          </>
        ) : (
          <>
            <p className="meta-label">MANAGE SUBSCRIPTION</p>
            <p className="text-secondary" style={{ marginTop: 6 }}>
              Your Pro subscription is active.
            </p>
            <button className="btn btn-danger" onClick={handleCancel} style={{ marginTop: 12 }}>
              Cancel Pro
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Pro;