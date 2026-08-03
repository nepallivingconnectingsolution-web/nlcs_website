import { Link } from 'react-router-dom';

export default function Logo({ label = 'NLCITS', to = '/', className = '' }) {
  return (
    <Link to={to} className={`brand ${className}`} aria-label={`${label} home`}>
      <img src="/logo.png" alt="" className="brand-logo" />
    </Link>
  );
}
