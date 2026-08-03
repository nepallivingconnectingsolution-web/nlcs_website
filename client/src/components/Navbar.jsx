import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import Magnetic from './Magnetic.jsx';
import { navLinks } from '../data/content.js';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile drawer on route change.
  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header className={scrolled ? 'scrolled' : ''}>
      <div className="wrap nav">
        <Logo label="NLCITS" />

        <nav>
          <ul className="nav-links">
            {navLinks.map((l) => {
              const isActive = l.to === '/' ? location.pathname === '/' : location.pathname.startsWith(l.to);
              return (
                <li key={l.to}>
                  {isActive && (
                    <motion.span
                      layoutId="navPill"
                      className="nav-pill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <NavLink to={l.to} end={l.to === '/'} className={isActive ? 'active' : ''}>
                    {l.label}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="nav-cta">
          <Magnetic>
            <Link to="/contact" className="btn btn-primary">
              Get in touch <Icon name="arrowRight" size={16} className="arr" />
            </Link>
          </Magnetic>
          <button
            className="menu-btn"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span style={open ? { transform: 'translateY(8px) rotate(45deg)' } : undefined} />
            <span style={open ? { opacity: 0 } : undefined} />
            <span style={open ? { transform: 'translateY(-8px) rotate(-45deg)' } : undefined} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
              Get in touch <Icon name="arrowRight" size={16} className="arr" />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
