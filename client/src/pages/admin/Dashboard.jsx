import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const cards = [
  { key: 'newContacts', label: 'New enquiries', icon: 'inbox', to: '/admin/enquiries', accent: 'blue' },
  { key: 'contacts', label: 'Total enquiries', icon: 'mail', to: '/admin/enquiries', accent: 'mint' },
  { key: 'services', label: 'Services', icon: 'layers', to: '/admin/services', accent: 'violet' },
  { key: 'projects', label: 'Projects', icon: 'briefcase', to: '/admin/projects', accent: 'amber' },
  { key: 'testimonials', label: 'Testimonials', icon: 'star', to: '/admin/testimonials', accent: 'blue' },
  { key: 'subscribers', label: 'Newsletter subscribers', icon: 'mail', to: '/admin/newsletter', accent: 'mint' },
];

function formatDay(d) {
  return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const chartTooltipStyle = {
  background: '#0A0E1A',
  border: 'none',
  borderRadius: 10,
  color: '#fff',
  fontSize: 13,
  padding: '8px 12px',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/stats')
      .then((res) => setStats(res.data.data))
      .catch((err) => setError(err.message));
    api
      .get('/dashboard/analytics?days=14')
      .then((res) => setAnalytics(res.data.data))
      .catch(() => {}); // non-critical — dashboard still works without charts
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

      {analytics && (
        <div className="chart-grid">
          <div className="chart-card">
            <h3>Enquiries — last 14 days</h3>
            <p className="sub">New contact form submissions per day.</p>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={analytics.byDay} margin={{ left: -20, right: 10 }}>
                <defs>
                  <linearGradient id="enqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F6BFF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2F6BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAF0FA" />
                <XAxis dataKey="date" tickFormatter={formatDay} fontSize={11.5} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} fontSize={11.5} tickLine={false} axisLine={false} width={28} />
                <Tooltip labelFormatter={formatDay} contentStyle={chartTooltipStyle} />
                <Area type="monotone" dataKey="count" name="Enquiries" stroke="#2F6BFF" strokeWidth={2.5} fill="url(#enqGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Most requested services</h3>
            <p className="sub">From all-time contact submissions.</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={analytics.byService} layout="vertical" margin={{ left: 10, right: 16 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#EAF0FA" />
                <XAxis type="number" allowDecimals={false} fontSize={11.5} tickLine={false} axisLine={false} />
                <YAxis
                  dataKey="service"
                  type="category"
                  width={110}
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => (v.length > 16 ? `${v.slice(0, 16)}…` : v)}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" name="Enquiries" fill="#1FD1A3" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

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
