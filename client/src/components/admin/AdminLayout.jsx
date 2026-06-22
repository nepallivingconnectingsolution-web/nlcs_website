import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../Icon.jsx';

const nav = [
  { to: '/admin', label: 'Dashboard', icon: 'grid', end: true },
  { to: '/admin/enquiries', label: 'Enquiries', icon: 'inbox' },
  { to: '/admin/services', label: 'Services', icon: 'layers' },
  { to: '/admin/projects', label: 'Projects', icon: 'briefcase' },
  { to: '/admin/users', label: 'Users', icon: 'shield', superOnly: true },
];

const roleLabel = { superadmin: 'Super Admin', admin: 'Admin', editor: 'Editor' };

export default function AdminLayout() {
  const { user, logout, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar ${open ? 'open' : ''}`}>
        <div className="admin-brand">
          <svg className="brand-logo" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect width="40" height="40" rx="11" fill="url(#ag)" />
            <circle cx="13" cy="13" r="3.2" fill="#fff" />
            <circle cx="27" cy="13" r="3.2" fill="#fff" opacity=".85" />
            <circle cx="20" cy="27" r="3.2" fill="#fff" opacity=".7" />
            <path d="M13 13 L27 13 M13 13 L20 27 M27 13 L20 27" stroke="#fff" strokeWidth="1.6" opacity=".55" />
            <defs><linearGradient id="ag" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#2F6BFF" /><stop offset="1" stopColor="#1FD1A3" /></linearGradient></defs>
          </svg>
          <div>
            <strong>NLCS</strong>
            <span>Control Panel</span>
          </div>
        </div>

        <nav className="admin-nav">
          {nav
            .filter((n) => !n.superOnly || isSuperAdmin)
            .map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) => `admin-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <Icon name={n.icon} size={19} />
                {n.label}
              </NavLink>
            ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <Icon name="logout" size={18} /> Sign out
        </button>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-burger" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            <Icon name="menu" size={22} />
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="admin-viewsite">
            View live site →
          </a>
          <div className="admin-user">
            <div className="admin-avatar">{(user?.name || 'A').charAt(0).toUpperCase()}</div>
            <div className="admin-user-meta">
              <strong>{user?.name}</strong>
              <span className={`role-pill role-${user?.role}`}>{roleLabel[user?.role] || user?.role}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>

      {open && <div className="admin-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}
