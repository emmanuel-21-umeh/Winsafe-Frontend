import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('football');
  const [event_date, setEventDate] = useState('');
  const [sponsorId, setSponsorId] = useState('');
  const [outcomes, setOutcomes] = useState([{ name: '', odds: 2 }]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  const fetchEvents = () => {
    axios.get('http://127.0.0.1:5000/api/events')
      .then(res => setEvents(res.data.events || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const fetchSponsors = () => {
    axios.get('http://127.0.0.1:5000/api/sponsors', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setSponsors(res.data.sponsors || []))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchEvents();
    fetchSponsors();
  }, []);

  const addOutcome = () => {
    setOutcomes([...outcomes, { name: '', odds: 2 }]);
  };

  const updateOutcome = (index, field, value) => {
    const updated = [...outcomes];
    updated[index][field] = value;
    setOutcomes(updated);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      await axios.post('http://127.0.0.1:5000/api/admin/events', {
        title,
        category,
        event_date,
        outcomes,
        sponsor_id: sponsorId || null
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage('Event created successfully');
      setTitle('');
      setEventDate('');
      setSponsorId('');
      setOutcomes([{ name: '', odds: 2 }]);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/admin/events/delete', 
        { event_id: eventId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleStatusChange = async (eventId, status) => {
    try {
      await axios.post('http://127.0.0.1:5000/api/admin/events/update-status', 
        { event_id: eventId, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleSetWinner = async (eventId, outcomeId) => {
    if (!window.confirm('Set this outcome as the winner? This will settle all predictions.')) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/admin/events/set-winner', 
        { event_id: eventId, winning_outcome_id: outcomeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to set winner');
    }
  };

  const handleDeleteOutcome = async (outcomeId) => {
    if (!window.confirm('Delete this outcome?')) return;
    try {
      await axios.post('http://127.0.0.1:5000/api/admin/outcomes/delete', 
        { outcome_id: outcomeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchEvents();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete outcome failed');
    }
  };

  return (
    <div className="page-wrap">
      <BackButton />

      <div className="page-heading">
        <div>
          <h1>Manage Events</h1>
          <p className="text-secondary">Create, edit, settle, and delete prediction events.</p>
        </div>
      </div>

      <div className="card">
        <h3>Create Event</h3>
        {message && <p className="success-text">{message}</p>}
        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleCreate}>
          <input
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event Title"
          />
          <input
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (football, entertainment, local)"
          />
          <input
            className="input"
            value={event_date}
            onChange={(e) => setEventDate(e.target.value)}
            placeholder="Event Date (YYYY-MM-DD HH:MM:SS)"
          />

          <label className="input-label">Sponsor (Optional)</label>
          <select
            className="input"
            value={sponsorId}
            onChange={(e) => setSponsorId(e.target.value)}
          >
            <option value="">No Sponsor</option>
            {sponsors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <h3 style={{ marginTop: 16 }}>Outcomes</h3>
          {outcomes.map((outcome, index) => (
            <div key={index} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <input
                className="input"
                value={outcome.name}
                onChange={(e) => updateOutcome(index, 'name', e.target.value)}
                placeholder="Outcome name"
              />
              <input
                className="input"
                type="number"
                value={outcome.odds}
                onChange={(e) => updateOutcome(index, 'odds', Number(e.target.value))}
                placeholder="Odds"
                min="1"
                step="0.1"
              />
            </div>
          ))}

          <button type="button" className="btn btn-secondary" onClick={addOutcome}>Add Outcome</button>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>Create Event</button>
        </form>
      </div>

      <div className="section-heading">
        <h2>Existing Events</h2>
      </div>

      {loading && <p className="text-secondary">Loading events...</p>}

      {events.map(event => (
        <div className="card" key={event.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3>{event.title}</h3>
            <span className="badge badge-accent">{event.status}</span>
          </div>
          <p className="text-secondary">Category: {event.category}</p>
          <p className="text-secondary">Date: {event.event_date}</p>
          {event.sponsor_name && (
            <p className="text-secondary">Sponsored by: {event.sponsor_name}</p>
          )}

          <div style={{ marginTop: 12 }}>
            <p className="meta-label">Outcomes</p>
            {event.outcomes?.map(outcome => (
              <div key={outcome.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #20262D' }}>
                <span>{outcome.name} ({outcome.odds}x)</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {event.status !== 'completed' && (
                    <>
                      <button className="btn btn-primary btn-sm" onClick={() => handleSetWinner(event.id, outcome.id)}>Set Winner</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteOutcome(outcome.id)}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            {event.status !== 'completed' && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(event.id, 'live')}>Set Live</button>
                <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(event.id, 'upcoming')}>Set Upcoming</button>
              </>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => handleDeleteEvent(event.id)}>Delete Event</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminEvents;