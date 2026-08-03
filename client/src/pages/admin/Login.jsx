import { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../../components/Icon.jsx';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) {
   return <Navigate to="/admin" replace />;
 }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <svg className="brand-logo" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect width="40" height="40" rx="11" fill="url(#lg)" />
            <circle cx="13" cy="13" r="3.2" fill="#fff" />
            <circle cx="27" cy="13" r="3.2" fill="#fff" opacity=".85" />
            <circle cx="20" cy="27" r="3.2" fill="#fff" opacity=".7" />
            <path d="M13 13 L27 13 M13 13 L20 27 M27 13 L20 27" stroke="#fff" strokeWidth="1.6" opacity=".55" />
            <defs><linearGradient id="lg" x1="0" y1="0" x2="40" y2="40"><stop stopColor="#1D4FD8" /><stop offset="1" stopColor="#1F8A55" /></linearGradient></defs>
          </svg>
          <h1>NLCITS Control Panel</h1>
          <p>Sign in to manage your website</p>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@nlcsitservice.com"
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <div className="pw-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="pw-toggle"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
              </button>
            </div>
          </div>

          <div className="login-links">
            <Link to="/admin/forgot-password">Forgot password?</Link>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn btn-primary login-submit" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
            {!busy && <Icon name="arrowRight" size={16} className="arr" />}
          </button>
        </form>

        <Link to="/" className="login-back">← Back to website</Link>
      </div>
    </div>
  );
}