import { motion, useReducedMotion } from 'framer-motion';

/**
 * Fade/slide content in as it scrolls into view, powered by Framer Motion.
 * Same API as the original CSS/IntersectionObserver version so every
 * existing call site (`<Reveal delay={..}>`) keeps working unchanged.
 */
export default function Reveal({
  children,
  delay = 0,
  as = 'div',
  className = '',
  y = 26,
  once = true,
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const Tag = motion[as] || motion.div;

  if (prefersReduced) {
    const Plain = as;
    return (
      <Plain className={className} {...rest}>
        {children}
      </Plain>
    );
  }

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.18 }}
      transition={{ duration: 0.7, delay: delay / 1000, ease: [0.2, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
