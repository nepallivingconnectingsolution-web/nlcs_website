import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import Magnetic from './Magnetic.jsx';
import api from '../api/axios.js';
import { company, navLinks } from '../data/content.js';

const footerServices = [
  'Web Development',
  'App Development',
  'Software Development',
  'CRM & ERP Solutions',
  'E-Commerce Solution',
  'IT Consulting & Support',
];

function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const res = await api.post('/newsletter', { email, source: 'footer' });
      toast.success(res.data.message || 'Subscribed!');
      setEmail('');
    } catch (err) {
      toast.error(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="foot-news">
      <h5>Stay in the loop</h5>
      <p style={{ color: '#97a2bd', fontSize: '.87rem', margin: 0 }}>
        Occasional updates on new work — no spam.
      </p>
      <form onSubmit={submit}>
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <Magnetic>
          <button type="submit" className="btn btn-primary" disabled={loading} aria-label="Subscribe">
            <Icon name="send" size={16} />
          </button>
        </Magnetic>
      </form>
    </div>
  );
}

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo label="NLCITS Pvt. Ltd." />
            <p>{company.blurb}</p>
            <p className="foot-hours">Sun – Fri 9:00–18:00 · Saturday closed</p>
            <div className="foot-soc">
              {company.socials.map((s) => (
                <Magnetic key={s.name} strength={0.5}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                    <Icon name={s.icon} size={18} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>

          <div className="foot-col">
            <h5>Services</h5>
            <ul>
              {footerServices.map((s) => (
                <li key={s}>
                  <Link to="/services">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Company</h5>
            <ul>
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="foot-col">
            <h5>Our Office</h5>
            <ul>
              <li>{company.address}</li>
              <li>
                <a href={company.phoneHref}>{company.phone}</a>
              </li>
              <li>
                <a href={`mailto:${company.email}`}>{company.email}</a>
              </li>
            </ul>
            <Newsletter />
          </div>
        </div>

        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} {company.legalName}. All rights reserved.</span>
          <span>Kathmandu, Nepal</span>
        </div>
      </div>
    </footer>
  );
}
