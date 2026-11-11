import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdModal from '../components/AdModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total_predictions: 0, wins: 0, prediction_points: 0 });
  const [events, setEvents] = useState([]);
  const [pools, setPools] = useState({ daily: 0, weekly: 0, monthly: 0 });
  const [unclaimed, setUnclaimed] = useState({ unclaimed_days: 0, unclaimed_amount: 0 });
  const [loading, setLoading] = useState(true);
  const [adMessage, setAdMessage] = useState('');
  const [showAd, setShowAd] = useState(false);
  const [adConfig, setAdConfig] = useState({ mock_duration_seconds: 15, reward_amount: 10 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const token = localStorage.getItem('token');

    const fetchDashboard = async () => {
      try {
        const [eventsRes, prizeRes, statsRes, adRes, unclaimedRes] = await Promise.all([
          axios.get('http://127.0.0.1:5000/api/events'),
          axios.get('http://127.0.0.1:5000/api/prize-pool/today'),
          axios.get('http://127.0.0.1:5000/api/auth/stats', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://127.0.0.1:5000/api/ads/config'),
          axios.get('http://127.0.0.1:5000/api/dp/unclaimed', {
            headers: { Authorization: `Bearer ${token}` }
          }).catch(() => ({ data: { unclaimed_days: 0, unclaimed_amount: 0 } }))
        ]);
        setEvents(eventsRes.data.events || []);
        setPools(prizeRes.data);
        setStats(statsRes.data.stats);
        setAdConfig(adRes.data);
        setUnclaimed(unclaimedRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const claimAdReward = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/ads/reward', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.daily_points = res.data.new_daily_points;
      localStorage.setItem('user', JSON.stringify(storedUser));
      setUser(storedUser);

      setAdMessage(`+${res.data.points_awarded} DP earned`);
      setTimeout(() => setAdMessage(''), 3000);
    } catch (err) {
      setAdMessage('Failed to reward ad');
      setTimeout(() => setAdMessage(''), 3000);
    }
    setShowAd(false);
  };

  const claimDp = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://127.0.0.1:5000/api/dp/claim', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.claimed > 0) {
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.daily_points = res.data.new_daily_points;
        localStorage.setItem('user', JSON.stringify(storedUser));
        setUser(storedUser);
        setUnclaimed({ unclaimed_days: 0, unclaimed_amount: 0 });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-wrap">
      <div className="page-heading">
        <div>
          <h1>Good evening</h1>
          <p className="text-secondary">Ready to make your next prediction?</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/events')}>
          Predict Now
        </button>
      </div>

      {unclaimed.unclaimed_days > 0 && (
        <div className="card card-accent" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div>
              <p className="meta-label">UNCLAIMED DP</p>
              <p className="stat-value">{unclaimed.unclaimed_amount} DP</p>
              <p className="text-secondary">{unclaimed.unclaimed_days} day(s) waiting to be claimed.</p>
            </div>
            <button className="btn btn-primary" onClick={claimDp}>Claim Now</button>
          </div>
        </div>
      )}

      <div className="grid-4" style={{ marginBottom: 20 }}>
        <div className="stat-card card-accent">
          <p className="meta-label">Daily Points</p>
          <p className="stat-value">{user?.daily_points ?? 0}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Prediction Points</p>
          <p className="stat-value" style={{ color: '#00C853' }}>{stats.prediction_points}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Predictions</p>
          <p className="stat-value">{stats.total_predictions}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Wins</p>
          <p className="stat-value">{stats.wins}</p>
        </div>
      </div>

      <div className="card card-accent" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p className="meta-label">EARN MORE POINTS</p>
            <p className="text-secondary" style={{ marginTop: 4 }}>
              Watch a rewarded ad to get +{adConfig.reward_amount} DP
            </p>
            {adMessage && <p className="success-text" style={{ marginTop: 4 }}>{adMessage}</p>}
          </div>
          <button className="btn btn-primary" onClick={() => setShowAd(true)}>
            Watch Ad
          </button>
        </div>
      </div>

      {loading && <p className="text-secondary">Loading events...</p>}

      {!loading && events.length > 0 && (
        <div className="card card-accent" style={{ marginBottom: 20 }}>
          <span className="badge badge-accent">FEATURED EVENT</span>
          <h2 style={{ margin: '10px 0 6px' }}>{events[0].title}</h2>
          <p className="text-secondary">{events[0].category}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '16px 0' }}>
            {events[0].outcomes?.map(outcome => (
              <div key={outcome.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{outcome.name}</span>
                <span className="text-secondary">{outcome.odds}x</span>
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => navigate(`/events/${events[0].id}`)}>
            MAKE PREDICTION
          </button>
        </div>
      )}

      <div className="section-heading">
        <h2>Trending Events</h2>
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/events')}>See all</button>
      </div>

      <div className="grid-3">
        {events.slice(0, 3).map(event => (
          <div className="card" key={event.id} onClick={() => navigate(`/events/${event.id}`)} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="badge badge-accent">{event.category}</span>
              <span className="text-secondary">{event.status}</span>
            </div>
            <h3>{event.title}</h3>
            <p className="text-secondary" style={{ marginTop: 6 }}>
              {new Date(event.event_date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="section-heading">
        <h2>Prize Pools</h2>
      </div>
      <div className="grid-3">
        <div className="stat-card">
          <p className="meta-label">Daily</p>
          <p className="stat-value" style={{ color: '#00C853' }}>₦{pools.daily.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Weekly</p>
          <p className="stat-value" style={{ color: '#00C853' }}>₦{pools.weekly.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <p className="meta-label">Monthly</p>
          <p className="stat-value" style={{ color: '#00C853' }}>₦{pools.monthly.toLocaleString()}</p>
        </div>
      </div>

      {showAd && (
        <AdModal
          duration={adConfig.mock_duration_seconds}
          onComplete={claimAdReward}
          onClose={() => setShowAd(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;