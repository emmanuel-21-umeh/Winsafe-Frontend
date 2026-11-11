import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10.5 12 3l9 7.5" />
          <path d="M5 9.5V21h14V9.5" />
        </svg>
        <span>Home</span>
      </NavLink>

      <NavLink to="/discover" className={({ isActive }) => isActive ? 'active' : ''}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2a15.3 15.3 0 0 1 0 20 15.3 15.3 0 0 1 0-20Z" />
          <path d="M2 12h20" />
        </svg>
        <span>Discover</span>
      </NavLink>

      <NavLink to="/events" className="predict-nav">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" fill="currentColor" />
          <circle cx="12" cy="12" r="1" fill="#070A08" />
        </svg>
        <span>Predict</span>
      </NavLink>

      <NavLink to="/leaderboard" className={({ isActive }) => isActive ? 'active' : ''}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21V11" />
          <path d="M12 21V4" />
          <path d="M16 21v-6" />
          <path d="M3 21h18" />
        </svg>
        <span>Ranks</span>
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" />
        </svg>
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;