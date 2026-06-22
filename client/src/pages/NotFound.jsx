import { Link } from 'react-router-dom';
import Icon from '../components/Icon.jsx';

export default function NotFound() {
  return (
    <section className="notfound">
      <div className="wrap">
        <span className="nf-code">404</span>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist or may have moved.</p>
        <Link to="/" className="btn btn-primary">
          Back to home <Icon name="arrowRight" size={16} className="arr" />
        </Link>
      </div>
    </section>
  );
}
