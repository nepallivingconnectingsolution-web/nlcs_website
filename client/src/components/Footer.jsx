import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { company, navLinks } from '../data/content.js';

const footerServices = [
  'Web Development',
  'App Development',
  'Software Development',
  'CRM & ERP Solutions',
  'E-Commerce Solution',
  'IT Consulting & Support',
];

export default function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div className="foot-brand">
            <Logo label="NLCS Pvt. Ltd." />
            <p>{company.blurb}</p>
            <p className="foot-hours">Sun – Fri 9:00–18:00 · Saturday closed</p>
            <div className="foot-soc">
              {company.socials.map((s) => (
                <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                  <Icon name={s.icon} size={18} />
                </a>
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
