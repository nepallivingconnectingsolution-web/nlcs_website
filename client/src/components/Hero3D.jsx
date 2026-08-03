import { lazy, Suspense, useEffect, useState } from 'react';
import HeroNetwork from './HeroNetwork.jsx';

const HeroScene = lazy(() => import('./HeroScene.jsx'));

/* Decide once, on mount, whether this device should get the full 3D scene.
   We stay conservative: reduced-motion, small/touch screens, and anything
   without WebGL2 all get the cheap 2D canvas instead. Nobody loses the
   "connecting nodes" motif either way. */
function useCanRender3D() {
  const [can, setCan] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const smallScreen = window.innerWidth < 760;
    let hasWebGL2 = false;
    try {
      const canvas = document.createElement('canvas');
      hasWebGL2 = !!canvas.getContext('webgl2');
    } catch {
      hasWebGL2 = false;
    }
    setCan(!reduce && !smallScreen && hasWebGL2);
  }, []);

  return can;
}

export default function Hero3D() {
  const can3D = useCanRender3D();
  const [ready, setReady] = useState(false);

  if (!can3D) return <HeroNetwork />;

  return (
    <div className={`hero-3d ${ready ? 'ready' : ''}`}>
      <Suspense fallback={null}>
        <HeroScene />
      </Suspense>
      {/* Mount signal: the Canvas itself renders synchronously once the
          lazy chunk resolves, so flip the fade-in on the next frame. */}
      <ReadyFlag onReady={() => setReady(true)} />
    </div>
  );
}

function ReadyFlag({ onReady }) {
  useEffect(() => {
    const id = requestAnimationFrame(() => requestAnimationFrame(onReady));
    return () => cancelAnimationFrame(id);
  }, [onReady]);
  return null;
}
