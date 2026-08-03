import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ state: 'idle', message: '', devResetUrl: '' });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setStatus({ state: 'idle', message: '' });
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setStatus({
        state: 'success',
        message: res.data.message,
        devResetUrl: res.data.devResetUrl || '',
      });
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Something went wrong.' });
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
          <h1>Reset your password</h1>
          <p>Enter your admin email and we'll send you a reset link.</p>
        </div>

        {status.state !== 'success' && (
          <form onSubmit={onSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nlcsitservice.com"
              />
            </div>

            {status.state === 'error' && <p className="login-error">{status.message}</p>}

            <button className="btn btn-primary login-submit" type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send reset link'}
              {!busy && <Icon name="arrowRight" size={16} className="arr" />}
            </button>
          </form>
        )}

        {status.state === 'success' && (
          <div>
            <p className="login-success">{status.message}</p>
            {status.devResetUrl && (
              <p className="login-hint">
                <strong>Dev mode</strong> (no SMTP configured) — here's your reset link directly:
                <br />
                <a href={status.devResetUrl}>{status.devResetUrl}</a>
              </p>
            )}
          </div>
        )}

        <Link to="/admin/login" className="login-back">← Back to sign in</Link>
      </div>
    </div>
  );
}