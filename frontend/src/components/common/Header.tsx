import { useAuth } from '../../hooks/useAuth';
import './header.css';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-left">
        <h2 className="header-title">Welcome back, {user?.firstName}</h2>
      </div>

      <div className="header-right">
        <div className="header-user">
          <div className="header-avatar">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </div>
          <span className="header-username">{user?.firstName} {user?.lastName}</span>
        </div>
        <button className="header-logout" onClick={logout} aria-label="Sign out">
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Header;
