import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import TiltCard from '../components/TiltCard.jsx';
import SEO from '../components/SEO.jsx';
import { values, company } from '../data/content.js';

const beliefs = [
  { icon: 'zap', title: 'Technology should simplify', text: 'We build tools that remove friction from operations rather than adding to it.' },
  { icon: 'users', title: 'Partnerships over transactions', text: 'We work as an extension of your team, invested in your long-term success.' },
  { icon: 'globe', title: 'Local roots, global standards', text: 'Proudly based in Kathmandu, delivering work that competes anywhere in the world.' },
];

export default function About() {
  return (
    <>
      <SEO
        title="About Us"
        description={`Learn about ${company.legalName} — a Kathmandu-based team of developers, designers, and IT professionals building digital products for businesses in Nepal and beyond.`}
        path="/about"
      />

      <section className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow on-dark">About NLCITS</span>
            <h1>Your trusted technology partner</h1>
            <p className="lead">
              At {company.legalName}, we help businesses embrace digital transformation through
              innovative technology solutions — improving efficiency, productivity, and growth.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="intro light">
        <div className="wrap intro-grid">
          <Reveal>
            <span className="eyebrow">Who We Are</span>
            <h2 className="intro-title">A team of builders, designers, and problem-solvers</h2>
            <p className="body">
              We believe technology should simplify operations, improve customer engagement, and
              create new opportunities for success. Our developers, designers, marketers, and IT
              professionals work together to deliver high-quality services that fit your goals.
            </p>
            <p className="body">
              Whether you're a startup, a small business, or a large enterprise, we provide
              customized solutions designed around the way you actually work.
            </p>
            <div className="values">
              {values.map((v) => (
                <span className="tag" key={v}><b>+</b> {v}</span>
              ))}
            </div>
          </Reveal>

          <Reveal className="pillars">
            <div className="pillar wide">
              <div className="pi"><Icon name="zap" size={22} /></div>
              <h4>Our Mission</h4>
              <p>To empower businesses with innovative technology solutions that drive growth, efficiency, and digital success.</p>
            </div>
            <div className="pillar wide">
              <div className="pi"><Icon name="eye" size={22} /></div>
              <h4>Our Vision</h4>
              <p>To become one of Nepal's most trusted and leading IT solution providers, delivering world-class digital services globally.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="beliefs">
        <div className="wrap">
          <Reveal>
            <div className="sec-head center">
              <span className="eyebrow">What We Believe</span>
              <h2>Principles that guide our work</h2>
            </div>
          </Reveal>
          <div className="beliefs-grid">
            {beliefs.map((b, i) => (
              <Reveal key={b.title} delay={(i % 3) * 70}>
                <TiltCard max={7}>
                  <div className="belief">
                    <div className="belief-ic"><Icon name={b.icon} size={24} /></div>
                    <h4>{b.title}</h4>
                    <p>{b.text}</p>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <Reveal>
            <h2>Let's build something together</h2>
            <p>From your first idea to a product your customers love — we'd love to help.</p>
            <Link to="/contact" className="btn btn-primary">
              Get in touch <Icon name="arrowRight" size={16} className="arr" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
