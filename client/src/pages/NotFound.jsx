import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/Icon.jsx';
import SEO from '../components/SEO.jsx';

export default function NotFound() {
  return (
    <section className="notfound">
      <SEO title="Page Not Found" description="The page you're looking for doesn't exist or may have moved." noindex />
      <div className="wrap">
        <motion.span
          className="nf-code"
          initial={{ opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.2, 0.7, 0.2, 1] }}
        >
          404
        </motion.span>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <h1>Page not found</h1>
          <p>The page you're looking for doesn't exist or may have moved.</p>
          <Link to="/" className="btn btn-primary">
            Back to home <Icon name="arrowRight" size={16} className="arr" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
