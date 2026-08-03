import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../api/axios.js';
import Icon from '../../components/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { applySession } = useAuth();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setBusy(true);
    try {
      const res = await api.post(`/auth/reset-password/${token}`, { password });
      applySession(res.data.data);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'This reset link is invalid or has expired.');
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
          <h1>Set a new password</h1>
          <p>Choose a new password for your admin account.</p>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="password">New password</label>
            <div className="pw-wrap">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
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

          <div className="field">
            <label htmlFor="confirm">Confirm new password</label>
            <div className="pw-wrap">
              <input
                id="confirm"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Re-enter password"
              />
            </div>
          </div>

          {error && <p className="login-error">{error}</p>}

          <button className="btn btn-primary login-submit" type="submit" disabled={busy}>
            {busy ? 'Updating…' : 'Reset password'}
            {!busy && <Icon name="arrowRight" size={16} className="arr" />}
          </button>
        </form>

        <Link to="/admin/login" className="login-back">← Back to sign in</Link>
      </div>
    </div>
  );
}