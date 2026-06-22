import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import { ServiceCard } from '../components/Cards.jsx';
import useFetch from '../hooks/useFetch.js';
import { fallbackServices, process } from '../data/content.js';

export default function Services() {
  const { data: services, loading } = useFetch('/services', { fallback: fallbackServices });

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow on-dark">What We Do</span>
            <h1>Services that move your business forward</h1>
            <p className="lead">
              From first line of code to launch day and beyond — explore the full range of digital
              solutions we deliver for businesses in Nepal and worldwide.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="services light">
        <div className="wrap">
          {loading && <p className="muted-center">Loading services…</p>}
          <div className="svc-grid">
            {(services || []).map((s, i) => (
              <Reveal key={s._id || s.slug} delay={(i % 3) * 70}>
                <ServiceCard service={s} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="process">
        <div className="wrap">
          <Reveal>
            <div className="sec-head">
              <span className="eyebrow">How We Work</span>
              <h2>Our delivery process</h2>
              <p>A clear, repeatable path that keeps every engagement on time and on target.</p>
            </div>
          </Reveal>
          <div className="steps">
            {process.map((p, i) => (
              <Reveal key={p.step} delay={(i % 3) * 70}>
                <div className="step">
                  <div className="sn">STEP {p.step}</div>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <Reveal>
            <h2>Not sure which service you need?</h2>
            <p>Tell us about your goals and we'll recommend the right approach — no obligation.</p>
            <Link to="/contact" className="btn btn-primary">
              Talk to our team <Icon name="arrowRight" size={16} className="arr" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
