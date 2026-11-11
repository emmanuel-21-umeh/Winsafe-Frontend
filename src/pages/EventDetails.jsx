import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [selectedOutcome, setSelectedOutcome] = useState(null);
  const [points, setPoints] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    axios.get(`http://127.0.0.1:5000/api/events/${id}`)
      .then(res => setEvent(res.data.event))
      .catch(() => setError('Failed to load event'))
      .finally(() => setLoading(false));
  }, [id]);

  const handlePrediction = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!selectedOutcome) {
      setError('Please select an outcome');
      return;
    }

    const pointsNum = Number(points);
    if (!pointsNum || pointsNum <= 0 || pointsNum % 10 !== 0) {
      setError('Points must be a multiple of 10');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/predictions', {
        outcome_id: selectedOutcome,
        points: pointsNum
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.daily_points = res.data.remaining_daily_points;
      localStorage.setItem('user', JSON.stringify(storedUser));
      setUser(storedUser);

      setMessage('Prediction placed successfully');
      setPoints('');
      setSelectedOutcome(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed');
    }
  };

  if (loading) {
    return (
      <div className="page-wrap">
        <BackButton />
        <p className="text-secondary">Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-wrap">
        <BackButton />
        <p className="text-secondary">Event not found</p>
        <button className="btn btn-secondary" onClick={() => navigate('/events')}>Back to Events</button>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <span className="badge badge-accent">{event.category}</span>
          <h1 style={{ marginTop: 8 }}>{event.title}</h1>
          <p className="text-secondary">{new Date(event.event_date).toLocaleString()}</p>
          {event.sponsor_name && (
            <p className="text-secondary" style={{ fontSize: 12, marginTop: 4 }}>
              Sponsored by {event.sponsor_name}
            </p>
          )}
        </div>
      </div>

      <div className="card card-accent">
        <p className="meta-label">Your Daily Points</p>
        <p className="stat-value">{user?.daily_points ?? 0} DP</p>
      </div>

      <div className="card">
        <h3>Select Outcome</h3>
        <p className="text-secondary" style={{ marginTop: 4 }}>Choose the outcome you think will happen.</p>

        <div className="outcome-list">
          {event.outcomes.map(outcome => (
            <div
              key={outcome.id}
              className={`outcome-option ${selectedOutcome === outcome.id ? 'selected' : ''}`}
              onClick={() => setSelectedOutcome(outcome.id)}
            >
              <div>
                <p className="outcome-name">{outcome.name}</p>
                <p className="text-secondary">Odds: {outcome.odds}x</p>
              </div>
              <span className="outcome-check">
                {selectedOutcome === outcome.id ? '✓' : ''}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3>Allocate Points</h3>
        <p className="text-secondary" style={{ marginTop: 4 }}>
          Enter a multiple of 10 (10, 20, 30...).
        </p>

        <form onSubmit={handlePrediction}>
          <input
            type="number"
            className="input"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Enter points (multiple of 10)"
            min="10"
            step="10"
          />

          {error && <p className="error-text">{error}</p>}
          {message && <p className="success-text">{message}</p>}

          <button type="submit" className="btn btn-primary" disabled={!selectedOutcome}>
            Place Prediction
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventDetails;