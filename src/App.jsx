import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Predictions from './pages/Predictions';
import Leaderboard from './pages/Leaderboard';
import EventDetails from './pages/EventDetails';
import Wallet from './pages/Wallet';
import Discover from './pages/Discover';
import Events from './pages/Events';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminEvents from './pages/AdminEvents';
import AdminUsers from './pages/AdminUsers';
import AdminWithdrawals from './pages/AdminWithdrawals';
import AdminPrizePool from './pages/AdminPrizePool';
import Settings from './pages/Settings';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MobileBottomNav from './components/MobileBottomNav';
import ProtectedRoute from './components/ProtectedRoute';
import AdminPayouts from './pages/AdminPayouts';
import { useEffect } from 'react';
import axios from 'axios';
import AdminSessions from './pages/AdminSessions';
import Pro from './pages/Pro';
import AdminSubscriptions from './pages/AdminSubscriptions';

function AppLayout({ children }) {
  const location = useLocation();
  const authPages = ['/login', '/register'];

  useEffect(() => {
    if (authPages.includes(location.pathname)) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    let sessionId = null;

    axios.post('http://127.0.0.1:5000/api/sessions/start', {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => { sessionId = res.data.session_id; })
      .catch(err => console.error(err));

    const handleUnload = () => {
      if (sessionId) {
        navigator.sendBeacon(
          'http://127.0.0.1:5000/api/sessions/end',
          JSON.stringify({ session_id: sessionId })
        );
      }
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      if (sessionId) {
        axios.post('http://127.0.0.1:5000/api/sessions/end',
          { session_id: sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        ).catch(() => {});
      }
    };
  }, [location.pathname]);

  if (authPages.includes(location.pathname)) {
    return children;
  }

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Header />
        <main className="main-content">{children}</main>
      </div>
      <MobileBottomNav />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
          <Route path="/events/:id" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
          <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute adminOnly><AdminEvents /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/withdrawals" element={<ProtectedRoute adminOnly><AdminWithdrawals /></ProtectedRoute>} />
          <Route path="/admin/prize-pool" element={<ProtectedRoute adminOnly><AdminPrizePool /></ProtectedRoute>} />
<Route path="/admin/payouts" element={<ProtectedRoute adminOnly><AdminPayouts /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/login" />} />
          <Route path="/admin/sessions" element={<ProtectedRoute adminOnly><AdminSessions /></ProtectedRoute>} />
        <Route path="/pro" element={<ProtectedRoute><Pro /></ProtectedRoute>} />
        <Route path="/admin/subscriptions" element={<ProtectedRoute adminOnly><AdminSubscriptions /></ProtectedRoute>} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;