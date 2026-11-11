import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const Leaderboard = () => {
  const [period, setPeriod] = useState('daily');
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://127.0.0.1:5000/api/leaderboard/${period}`)
      .then(res => setLeaderboard(res.data.leaderboard || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load leaderboard'))
      .finally(() => setLoading(false));
  }, [period]);

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Leaderboard</h1>
          <p className="text-secondary">Top predictors by Prediction Points.</p>
        </div>
      </div>

      <div className="filter-row">
        <button
          className={`chip ${period === 'daily' ? 'active' : ''}`}
          onClick={() => setPeriod('daily')}
        >
          Daily
        </button>
        <button
          className={`chip ${period === 'weekly' ? 'active' : ''}`}
          onClick={() => setPeriod('weekly')}
        >
          Weekly
        </button>
        <button
          className={`chip ${period === 'monthly' ? 'active' : ''}`}
          onClick={() => setPeriod('monthly')}
        >
          Monthly
        </button>
      </div>

      {loading && <p className="text-secondary">Loading leaderboard...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && leaderboard.length === 0 && (
        <div className="card empty-card">No predictions settled yet.</div>
      )}

      <div className="leaderboard-list">
        {leaderboard.map((user, index) => (
          <div
            key={user.id}
            className={`leaderboard-row ${index === 0 ? 'top-one' : index === 1 ? 'top-two' : index === 2 ? 'top-three' : ''}`}
          >
            <div className="rank-badge">{user.rank || index + 1}</div>

            <div className="leaderboard-user">
              <div className="user-avatar">
                {user.phone_number?.charAt(0)}
              </div>
              <div>
                <p className="user-phone">{user.phone_number}</p>
                <p className="text-secondary">Wins: {user.wins || 0}</p>
              </div>
            </div>

            <div className="leaderboard-stats">
              <p className="points-value">{user.total_pp || 0}</p>
              <p className="text-secondary">PP</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;