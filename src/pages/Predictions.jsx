import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const Predictions = () => {
  const [predictions, setPredictions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    axios.get('http://127.0.0.1:5000/api/predictions/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setPredictions(res.data.predictions || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load predictions'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>My Predictions</h1>
          <p className="text-secondary">Track your prediction history.</p>
        </div>
      </div>

      {loading && <p className="text-secondary">Loading predictions...</p>}
      {error && <p className="error-text">{error}</p>}

      {!loading && predictions.length === 0 && (
        <div className="card empty-card">You haven't made any predictions yet.</div>
      )}

      <div className="prediction-list">
        {predictions.map(prediction => (
          <div className="card prediction-card" key={prediction.id}>
            <div className="prediction-header">
              <span className="badge badge-accent">{prediction.event_title}</span>
              <span className={`badge ${prediction.status === 'won' ? 'badge-success' : prediction.status === 'lost' ? 'badge-danger' : 'badge-warning'}`}>
                {prediction.status}
              </span>
            </div>

            <div className="prediction-body">
              <div>
                <p className="meta-label">Outcome</p>
                <p className="prediction-outcome">{prediction.outcome_name}</p>
              </div>
              <div>
                <p className="meta-label">Points</p>
                <p className="prediction-points">{prediction.points_allocated}</p>
              </div>
            </div>

            <p className="text-secondary">
              {new Date(prediction.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Predictions;