import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from './Reveal.jsx';
import Icon from './Icon.jsx';

export default function FAQAccordion({ items, eyebrow = 'FAQ', title = 'Questions, answered' }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="faq">
      <div className="wrap">
        <Reveal>
          <div className="sec-head center">
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
        </Reveal>

        <div className="faq-list">
          {items.map((item, i) => {
            const open = openIndex === i;
            return (
              <Reveal key={item.q} delay={i * 50}>
                <div className={`faq-item ${open ? 'open' : ''}`}>
                  <button
                    className="faq-q"
                    onClick={() => setOpenIndex(open ? -1 : i)}
                    aria-expanded={open}
                  >
                    {item.q}
                    <span className="faq-ic">
                      <Icon name="plus" size={16} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p className="faq-a" style={{ paddingBottom: 22 }}>
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
