import { useOutlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollProgress from './ScrollProgress.jsx';
import Cursor from './Cursor.jsx';

const pageVariants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

/* Chrome for the public marketing site. Admin routes use AdminLayout instead. */
export default function PublicLayout() {
  const location = useLocation();
  const element = useOutlet();

  return (
    <>
      <ScrollProgress />
      <Cursor />
      <Navbar />
      <main>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {element}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
