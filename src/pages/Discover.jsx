import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

const Discover = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    axios.get('http://127.0.0.1:5000/api/events')
      .then(res => setEvents(res.data.events || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const categories = ['all', ...new Set(events.map(event => event.category))];

  const filteredEvents = category === 'all'
    ? events
    : events.filter(event => event.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Discover</h1>
          <p className="text-secondary">Explore prediction markets and events.</p>
        </div>
      </div>

      <div className="filter-row">
        {categories.map(cat => (
          <button
            key={cat}
            className={`chip ${category === cat ? 'active' : ''}`}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="text-secondary">Loading events...</p>}

      {!loading && filteredEvents.length === 0 && (
        <div className="card empty-card">No events available.</div>
      )}

      <div className="event-grid">
        {filteredEvents.map(event => (
          <div
            className="card event-card"
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="badge badge-accent">{event.category}</span>
              <span className="text-secondary">{event.status}</span>
            </div>

            <h3>{event.title}</h3>

            {event.sponsor_name && (
              <p className="text-secondary" style={{ fontSize: 11 }}>
                Sponsored by {event.sponsor_name}
              </p>
            )}

            <p className="text-secondary">
              {new Date(event.event_date).toLocaleString()}
            </p>

            <div className="outcome-preview">
              {event.outcomes?.slice(0, 3).map(outcome => (
                <span key={outcome.id} className="outcome-chip">{outcome.name}</span>
              ))}
            </div>

            <button className="btn btn-secondary btn-sm">View Event</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Discover;