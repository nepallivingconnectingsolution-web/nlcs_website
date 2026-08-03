import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import PublicLayout from './components/PublicLayout.jsx';
import OrganizationJsonLd from './components/OrganizationJsonLd.jsx';
import PageLoader from './components/PageLoader.jsx';

// Public pages — lazy-loaded so the initial bundle stays lean; each route
// chunk (including its share of three.js on Home) loads on demand.
const Home = lazy(() => import('./pages/Home.jsx'));
const Services = lazy(() => import('./pages/Services.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

// Admin
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute.jsx'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout.jsx'));
const Login = lazy(() => import('./pages/admin/Login.jsx'));
const ForgotPassword = lazy(() => import('./pages/admin/ForgotPassword.jsx'));
const ResetPassword = lazy(() => import('./pages/admin/ResetPassword.jsx'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard.jsx'));
const Enquiries = lazy(() => import('./pages/admin/Enquiries.jsx'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices.jsx'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects.jsx'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials.jsx'));
const AdminStats = lazy(() => import('./pages/admin/AdminStats.jsx'));
const AdminNewsletter = lazy(() => import('./pages/admin/AdminNewsletter.jsx'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers.jsx'));

export default function App() {
  return (
    <AuthProvider>
      <OrganizationJsonLd />
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ---------- Public site ---------- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* ---------- Admin ---------- */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
            <Route
              path="users"
              element={
                <ProtectedRoute roles={['superadmin', 'admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
