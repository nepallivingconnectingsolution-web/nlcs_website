import Reveal from './Reveal.jsx';
import TiltCard from './TiltCard.jsx';
import Icon from './Icon.jsx';
import useFetch from '../hooks/useFetch.js';
import { fallbackTestimonials } from '../data/content.js';

function initials(name = '') {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Testimonials() {
  const { data: testimonials } = useFetch('/testimonials?featured=true', { fallback: fallbackTestimonials });
  const list = testimonials?.length ? testimonials : fallbackTestimonials;

  return (
    <section className="testimonials">
      <div className="wrap">
        <Reveal>
          <div className="sec-head center">
            <span className="eyebrow">Client Voices</span>
            <h2>Trusted by teams who value doing it right</h2>
            <p>A few words from the people we've built products for.</p>
          </div>
        </Reveal>

        <div className="testi-track">
          {list.slice(0, 3).map((t, i) => (
            <Reveal key={t._id} delay={i * 90}>
              <TiltCard max={6}>
                <div className="testi-card">
                  <div className="testi-stars">
                    {Array.from({ length: t.rating || 5 }).map((_, s) => (
                      <Icon key={s} name="star" size={15} />
                    ))}
                  </div>
                  <p className="testi-quote">{t.quote}</p>
                  <div className="testi-person">
                    <div className="testi-avatar">
                      {t.avatar ? <img src={t.avatar} alt={t.name} /> : initials(t.name)}
                    </div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>
                        {t.role}
                        {t.company ? `, ${t.company}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
