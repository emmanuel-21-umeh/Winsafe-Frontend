import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

const Register = () => {
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [referred_by, setReferredBy] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://127.0.0.1:5000/api/auth/register', {
        phone_number,
        password,
        referred_by: referred_by || null
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <Logo size="small" />

        <h1>Create account</h1>
        <p className="text-secondary">Join WinSafe and start predicting risk-free.</p>

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
            placeholder="Minimum 6 characters"
          />

          <label className="input-label">Referral ID (Optional)</label>
          <input
            className="input"
            value={referred_by}
            onChange={(e) => setReferredBy(e.target.value)}
            placeholder="Enter referral ID"
          />

          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;