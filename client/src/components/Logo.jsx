import { Link } from 'react-router-dom';

export default function Logo({ label = 'NLCITS', to = '/', className = '' }) {
  return (
    <Link to={to} className={`brand ${className}`} aria-label={`${label} home`}>
      <svg className="brand-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect width="40" height="40" rx="11" fill="url(#brandg)" />
        <circle cx="13" cy="13" r="3.2" fill="#fff" />
        <circle cx="27" cy="13" r="3.2" fill="#fff" opacity=".85" />
        <circle cx="20" cy="27" r="3.2" fill="#fff" opacity=".7" />
        <path d="M13 13 L27 13 M13 13 L20 27 M27 13 L20 27" stroke="#fff" strokeWidth="1.6" opacity=".55" />
        <defs>
          <linearGradient id="brandg" x1="0" y1="0" x2="40" y2="40">
            <stop stopColor="#2F6BFF" />
            <stop offset="1" stopColor="#1FD1A3" />
          </linearGradient>
        </defs>
      </svg>
      <span>{label}</span>
    </Link>
  );
}
