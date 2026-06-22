import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const cards = [
  { key: 'newContacts', label: 'New enquiries', icon: 'inbox', to: '/admin/enquiries', accent: 'blue' },
  { key: 'contacts', label: 'Total enquiries', icon: 'mail', to: '/admin/enquiries', accent: 'mint' },
  { key: 'services', label: 'Services', icon: 'layers', to: '/admin/services', accent: 'violet' },
  { key: 'projects', label: 'Projects', icon: 'briefcase', to: '/admin/projects', accent: 'amber' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <div className="page-title">
        <div>
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'there'}</h1>
          <p>Here's what's happening across your website.</p>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}

      <div className="stat-grid">
        {cards.map((c) => (
          <Link to={c.to} key={c.key} className={`stat-card accent-${c.accent}`}>
            <div className="stat-ic"><Icon name={c.icon} size={22} /></div>
            <div className="stat-num">{stats ? stats.totals[c.key] ?? 0 : '—'}</div>
            <div className="stat-label">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="panel">
        <div className="panel-head">
          <h2>Recent enquiries</h2>
          <Link to="/admin/enquiries" className="panel-link">View all →</Link>
        </div>
        {!stats && !error && <p className="muted-center">Loading…</p>}
        {stats && stats.recent.length === 0 && <p className="muted-center">No enquiries yet.</p>}
        {stats && stats.recent.length > 0 && (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Service</th><th>Email</th><th>Status</th><th>Received</th></tr>
              </thead>
              <tbody>
                {stats.recent.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.service || '—'}</td>
                    <td>{c.email}</td>
                    <td><span className={`status status-${c.status}`}>{c.status}</span></td>
                    <td>{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
