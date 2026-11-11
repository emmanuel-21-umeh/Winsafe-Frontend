import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const fetchUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));

    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('http://127.0.0.1:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const freshUser = { ...res.data.user };
        localStorage.setItem('user', JSON.stringify(freshUser));
        setUser(freshUser);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchUser();

    const handleStorage = (e) => {
      if (e.key === 'user') fetchUser();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', fetchUser);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', fetchUser);
    };
  }, []);

  return (
    <header className="top-header">
      <div className="header-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input placeholder="Search events, markets..." />
      </div>

      <div className="header-actions">
        <button className="icon-btn">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="header-points" onClick={() => navigate('/wallet')}>
          <span className="points-dot" />
          <span>{user?.daily_points ?? 0} pts</span>
        </div>

        <div className="header-avatar" onClick={() => navigate('/profile')}>
          {user?.phone_number?.charAt(0) || 'W'}
        </div>
      </div>
    </header>
  );
};

export default Header;