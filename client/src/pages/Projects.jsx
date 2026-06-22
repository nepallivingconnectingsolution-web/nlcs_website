import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../components/Reveal.jsx';
import Icon from '../components/Icon.jsx';
import useFetch from '../hooks/useFetch.js';
import { fallbackProjects } from '../data/content.js';

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
            <div className="filters">
              {categories.map((c) => (
                <button
                  key={c}
                  className={`filter ${filter === c ? 'active' : ''}`}
                  onClick={() => setFilter(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </Reveal>

          {loading && <p className="muted-center">Loading projects…</p>}

          <div className="proj-grid">
            {visible.map((p, i) => (
              <Reveal key={p._id || p.slug} delay={(i % 3) * 70}>
                <article className="proj">
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
              </Reveal>
            ))}
          </div>

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
