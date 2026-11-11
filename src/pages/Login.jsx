import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const Login = () => {
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/login', {
        phone_number,
        password
      });

      localStorage.setItem('token', res.data.token);

      let user = res.data.user;

      // Try to claim pending DP (Pro users only)
      try {
        const claimRes = await axios.post(
          'http://127.0.0.1:5000/api/dp/claim',
          {},
          { headers: { Authorization: `Bearer ${res.data.token}` } }
        );
        if (claimRes.data.claimed > 0) {
          user.daily_points = claimRes.data.new_daily_points;
        }
      } catch (claimErr) {
        // Ignore claim errors; login still succeeds
      }

      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Logo size="small" />

        <h1>Welcome back</h1>
        <p className="text-secondary">Login to continue predicting.</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label className="input-label">Phone Number</label>
          <input
            className="input"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="08012345678"
          />

          <label className="input-label">Password</label>
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;