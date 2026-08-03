import { Link } from 'react-router-dom';
import Hero3D from '../components/Hero3D.jsx';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import TiltCard from '../components/TiltCard.jsx';
import Marquee from '../components/Marquee.jsx';
import StatsCounter from '../components/StatsCounter.jsx';
import Testimonials from '../components/Testimonials.jsx';
import FAQAccordion from '../components/FAQAccordion.jsx';
import SEO from '../components/SEO.jsx';
import { ServiceCard, SectionHeader } from '../components/Cards.jsx';
import useFetch from '../hooks/useFetch.js';
import { values, process, whyUs, fallbackServices, marqueeItems, faqs, company } from '../data/content.js';

export default function Home() {
  const { data: services } = useFetch('/services', { fallback: fallbackServices });

  return (
    <>
      <SEO
        title="Web, App & Software Development in Nepal"
        description={`${company.blurb} Full-stack web, app, and software development, CRM/ERP, and digital marketing — from Kathmandu to the world.`}
        path="/"
      />

      {/* ---------- HERO ---------- */}
      <section className="hero">
        <Hero3D />
        <div className="wrap hero-inner">
          <span className="eyebrow on-dark">Build Your Dream</span>
          <h1>
            Transforming ideas into <span className="grad">digital solutions</span>
          </h1>
          <p className="lead">
            Nepal Living Connecting IT Solution (NLCITS) Pvt. Ltd. builds software, websites, apps, and
            marketing that help businesses grow — engineered in Kathmandu, delivered worldwide.
          </p>
          <div className="hero-cta">
            <Link to="/services" className="btn btn-primary">
              Our services <Icon name="arrowRight" size={16} className="arr" />
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Contact us
            </Link>
          </div>
          <div className="hero-meta">
            <div className="mi"><b>Full-stack</b><span>Web · App · Software</span></div>
            <div className="mi"><b>End-to-end</b><span>Design to deployment</span></div>
            <div className="mi"><b>Nepal &amp; beyond</b><span>Local roots, global reach</span></div>
          </div>
          <Link to="/admin/login" style={{ position: 'absolute', top: '20px', right: '20px' }} aria-label="Admin login">
            <Icon name="shield" size={18} />
          </Link>
        </div>
        <div className="scroll-cue">
          <span>Scroll</span>
          <span className="line" />
        </div>
      </section>

      <Marquee items={marqueeItems} />

      {/* ---------- INTRO ---------- */}
      <section className="intro">
        <div className="wrap intro-grid">
          <Reveal>
            <span className="eyebrow">Your Trusted Technology Partner</span>
            <h2 className="intro-title">We help businesses embrace digital transformation</h2>
            <p className="body">
              Our team of developers, designers, marketers, and IT professionals work together to
              deliver high-quality services that improve efficiency, productivity, and business growth.
            </p>
            <p className="body">
              Whether you're a startup, a small business, or a large enterprise, we build customized
              solutions that fit your goals — simplifying operations, improving customer engagement,
              and creating new opportunities for success.
            </p>
            <div className="values">
              {values.map((v) => (
                <span className="tag" key={v}><b>+</b> {v}</span>
              ))}
            </div>
            <Link to="/contact" className="btn btn-dark intro-btn">
              Work with us <Icon name="arrowRight" size={16} className="arr" />
            </Link>
          </Reveal>

          <Reveal className="pillars">
            <div className="pillar">
              <div className="pi"><Icon name="zap" size={22} /></div>
              <h4>Our Mission</h4>
              <p>Empower businesses with innovative technology that drives growth, efficiency, and digital success.</p>
            </div>
            <div className="pillar">
              <div className="pi"><Icon name="eye" size={22} /></div>
              <h4>Our Vision</h4>
              <p>To become one of Nepal's most trusted IT providers, delivering world-class digital services globally.</p>
            </div>
            <div className="pillar">
              <div className="pi"><Icon name="users" size={22} /></div>
              <h4>Collaboration</h4>
              <p>Teamwork, open communication, and strong partnerships to achieve outstanding results.</p>
            </div>
            <div className="pillar">
              <div className="pi"><Icon name="award" size={22} /></div>
              <h4>Excellence</h4>
              <p>A standard we hold from the first consultation to final delivery — and the support that follows.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- SERVICES ---------- */}
      <section className="services mesh-bg" id="services">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              eyebrow="Build Your Digital Future"
              title="Our IT Services"
              text="A full range of digital solutions to launch, scale, and strengthen your business."
            />
          </Reveal>
          <div className="svc-grid">
            {(services || []).map((s, i) => (
              <Reveal key={s._id || s.slug} delay={(i % 3) * 70}>
                <TiltCard max={7}>
                  <ServiceCard service={s} index={i} />
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <StatsCounter  />

      {/* ---------- WHY ---------- */}
      <section className="why">
        <div className="wrap">
          <div className="why-top">
            <Reveal>
              <SectionHeader
                eyebrow="Why Choose Us"
                title="Committed to delivering reliable digital solutions"
                text="We build high-quality digital products that drive real results. Your business growth is our mission — from first consultation to final delivery."
                onDark
              />
            </Reveal>
            <Reveal delay={120}>
              <Link to="/contact" className="btn btn-primary why-cta">
                Get in touch <Icon name="arrowRight" size={16} className="arr" />
              </Link>
            </Reveal>
          </div>
          <div className="checks">
            {whyUs.map((c, i) => (
              <Reveal key={c.title} delay={(i % 4) * 60}>
                <div className="check">
                  <div className="ck"><Icon name="check" size={19} /></div>
                  <h4>{c.title}</h4>
                  <p>{c.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- PROCESS ---------- */}
      <section className="process">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              eyebrow="How We Work"
              title="A clear path from idea to launch"
              text="We follow industry-standard processes so every project ships on time, on budget, and beyond expectations."
            />
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

      <Testimonials />

      <FAQAccordion items={faqs} />

      {/* ---------- GLOBAL BAND ---------- */}
      <section className="global">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow on-dark center-eb">Global Reach</span>
            <h2>Connected globally, serving locally</h2>
            <p>
              NLCITS delivers world-class digital solutions to clients across Nepal and beyond,
              bridging local businesses and global technology standards — helping you compete on
              every level.
            </p>
            <div className="hero-cta center-cta">
              <Link to="/contact" className="btn btn-primary">
                Start a project <Icon name="arrowRight" size={16} className="arr" />
              </Link>
              <Link to="/services" className="btn btn-ghost">Explore services</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
