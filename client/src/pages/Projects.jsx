import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import TiltCard from '../components/TiltCard.jsx';
import SEO from '../components/SEO.jsx';
import useFetch from '../hooks/useFetch.js';
import { fallbackProjects } from '../data/content.js';

const API_ORIGIN = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const resolveImg = (url) => (url && !/^https?:\/\//i.test(url) ? `${API_ORIGIN}${url}` : url);

export default function Projects() {
  const { data: projects, loading } = useFetch('/projects', { fallback: fallbackProjects });
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const set = new Set((projects || []).map((p) => p.category));
    return ['All', ...set];
  }, [projects]);

  const visible = (projects || []).filter((p) => filter === 'All' || p.category === filter);

  return (
    <>
      <SEO
        title="Our Work"
        description="A selection of websites, e-commerce stores, custom software, and mobile apps NLCITS has designed and engineered for clients in Nepal and beyond."
        path="/projects"
      />

      <section className="page-hero">
        <div className="wrap">
          <Reveal>
            <span className="eyebrow on-dark">Our Work</span>
            <h1>Projects we're proud of</h1>
            <p className="lead">
              A selection of the digital products we've designed and engineered — from websites and
              e-commerce stores to custom software and mobile apps.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="projects">
        <div className="wrap">
          <Reveal>
            <div className="filters" role="tablist">
              {categories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={filter === c}
                  className={`filter ${filter === c ? 'active' : ''}`}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="proj-grid">
            {loading &&
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="skel skel-card" />)}
          </div>

          {!loading && (
            <motion.div className="proj-grid" layout>
              <AnimatePresence mode="popLayout">
                {visible.map((p, i) => (
                  <motion.div
                    key={p._id || p.slug}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.35, delay: (i % 3) * 0.05, ease: [0.2, 0.7, 0.2, 1] }}
                  >
                    <TiltCard max={6}>
                      <article className="proj">
                        <div className="proj-media">
                          {p.image ? (
                            <img src={resolveImg(p.image)} alt={p.title} loading="lazy" />
                          ) : (
                            <span className="ph"><Icon name="briefcase" size={30} /></span>
                          )}
                        </div>
                        <div className="proj-top">
                          <span className="proj-cat">{p.category}</span>
                          {p.url && (
                            <a className="proj-link" href={p.url} target="_blank" rel="noopener noreferrer" aria-label="Visit project">
                              <Icon name="arrowRight" size={16} />
                            </a>
                          )}
                        </div>
                        <h3>{p.title}</h3>
                        <p>{p.summary}</p>
                        {p.tags?.length > 0 && (
                          <div className="proj-tags">
                            {p.tags.map((t) => (
                              <span key={t}>{t}</span>
                            ))}
                          </div>
                        )}
                      </article>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {!loading && visible.length === 0 && (
            <p className="muted-center">No projects in this category yet.</p>
          )}
        </div>
      </section>

      <section className="cta-band">
        <div className="wrap">
          <Reveal>
            <h2>Have a project in mind?</h2>
            <p>Let's turn your idea into a product your customers will love.</p>
            <Link to="/contact" className="btn btn-primary">
              Start a project <Icon name="arrowRight" size={16} className="arr" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
