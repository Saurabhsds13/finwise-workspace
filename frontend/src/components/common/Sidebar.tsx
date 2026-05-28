import { NavLink } from 'react-router-dom';
import './sidebar.css';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/expenses', label: 'Expenses', icon: '💸' },
  { path: '/budget', label: 'Budget', icon: '📋' },
  { path: '/goals', label: 'Goals', icon: '🎯' },
  { path: '/analytics', label: 'Analytics', icon: '📈' },
  { path: '/ai-advisor', label: 'AI Advisor', icon: '🤖' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>FinWise</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link--active' : ''}`
            }
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
