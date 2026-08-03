import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import TiltCard from '../components/TiltCard.jsx';
import SEO from '../components/SEO.jsx';
import FAQAccordion from '../components/FAQAccordion.jsx';
import { ServiceCard } from '../components/Cards.jsx';
import useFetch from '../hooks/useFetch.js';
import { fallbackServices, process, faqs } from '../data/content.js';

export default function Services() {
  const { data: services, loading } = useFetch('/services', { fallback: fallbackServices });

  return (
    <>
      <SEO
        title="Our Services"
        description="Website development, app development, custom software, CRM/ERP systems, digital marketing, and IT consulting — full-stack solutions for growing businesses."
        path="/services"
      />

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
          <div className="svc-grid">
            {loading &&
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="skel skel-card" />)}
            {!loading &&
              (services || []).map((s, i) => (
                <Reveal key={s._id || s.slug} delay={(i % 3) * 70}>
                  <TiltCard max={7}>
                    <ServiceCard service={s} index={i} />
                  </TiltCard>
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

      <FAQAccordion items={faqs} eyebrow="Common Questions" title="Everything you might be wondering" />

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
