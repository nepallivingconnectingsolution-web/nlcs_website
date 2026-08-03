import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Wraps a card and tilts it in 3D toward the cursor, with a matching
 * "glare" highlight. Disabled on touch devices (no persistent pointer).
 */
export default function TiltCard({ children, className = '', max = 10, glare = true }) {
  const ref = useRef(null);
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { stiffness: 220, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(y, [0, 1], [max, -max]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-max, max]), springConfig);
  const glareX = useTransform(x, [0, 1], ['0%', '100%']);
  const glareY = useTransform(y, [0, 1], ['0%', '100%']);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div className="tilt-wrap">
      <motion.div
        ref={ref}
        className={`tilt-inner ${className}`}
        style={{ rotateX, rotateY, position: 'relative' }}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {children}
        {glare && (
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              pointerEvents: 'none',
              background: `radial-gradient(220px circle at ${glareX} ${glareY}, rgba(255,255,255,.35), transparent 60%)`,
              opacity: 0,
              transition: 'opacity .3s',
            }}
            whileHover={{ opacity: 1 }}
          />
        )}
      </motion.div>
    </div>
  );
}
