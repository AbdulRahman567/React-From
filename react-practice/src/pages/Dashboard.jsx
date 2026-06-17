import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-card__title">Dashboard</h1>
        <p className="auth-card__subtitle">
          You're logged in as <strong>{user?.fullName || user?.email}</strong>.
        </p>
        <p className="auth-card__subtitle">Email: {user?.email}</p>

        <button type="button" className="auth-card__submit" onClick={handleLogout}>
          Log out
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
