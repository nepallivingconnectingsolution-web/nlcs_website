// Single source of truth for company info + static fallback content.
// Services/projects are normally fetched from the API; if the API is
// unreachable, the UI falls back to these so the site always renders.

export const company = {
  name: 'NLCITS Pvt. Ltd.',
legalName: 'Nepal Living Connecting IT Solution Pvt. Ltd.',
  tagline: 'Transforming ideas into digital solutions',
  blurb:
    'We build reliable web, app, and software products for businesses across Nepal and beyond.',
  phone: '+977 9812082030',
  phoneHref: 'tel:+9779812082030',
  email: 'info@nlcsitservice.com',
  address: 'Nepal Living Connecting IT Solution Pvt. Ltd., Near Goldhunga, Tarakeshwar-4, Kathmandu 44600, Nepal',
  hours: [
    { days: 'Sunday – Friday', time: '09:00 AM – 06:00 PM' },
    { days: 'Saturday', time: 'Closed (Call or Email)' },
  ],
  socials: [
    { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61590384390259', icon: 'facebook' },
    { name: 'Instagram', href: 'https://www.instagram.com/nepallivingconnectingsolution/', icon: 'instagram' },
    { name: 'TikTok', href: 'https://www.tiktok.com/@nlcs.pvt.ltd', icon: 'tiktok' },
  ],
};

export const values = [
  'Innovation',
  'Integrity',
  'Excellence',
  'Customer Success',
  'Continuous Improvement',
  'Collaboration',
];

export const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Projects', to: '/projects' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

export const process = [
  { step: '01', title: 'Requirement Gathering', text: 'We listen first — collecting and clarifying your goals so the plan is built around what success looks like for you.' },
  { step: '02', title: 'Plan & Resources', text: 'We map a strategic roadmap and assign the right people, laying the groundwork for a smooth project.' },
  { step: '03', title: 'Design & Develop', text: 'We turn ideas into products that are visually appealing, technically robust, and built around real users.' },
  { step: '04', title: 'Quality Assurance', text: 'We rigorously test every element for reliability, so the product works the way it should before launch.' },
  { step: '05', title: 'Deployment', text: 'Once it meets our standards, we release it seamlessly and make sure everything runs as expected.' },
  { step: '06', title: 'Support & Maintenance', text: 'We keep your systems secure, reliable, and optimised — long after the first launch.' },
];

export const whyUs = [
  { title: 'Scalable Solutions', text: 'Built to grow with you, from your first users to your busiest day.' },
  { title: 'On-Time Delivery', text: 'Clear timelines and disciplined processes that keep projects on track.' },
  { title: 'Modern Tech Stack', text: 'Current, well-supported technologies chosen to fit each project.' },
  { title: 'Clean UI/UX', text: 'Interfaces that are a pleasure to use and easy to understand.' },
];

// Fallback services (mirror the seed data).
export const fallbackServices = [
  { _id: 's1', slug: 'website-development', icon: 'globe', title: 'Website Development', summary: 'Professional, responsive, and SEO-friendly websites tailored to your business needs.' },
  { _id: 's2', slug: 'app-development', icon: 'smartphone', title: 'App Development', summary: 'Custom Android and iOS applications built for performance, scalability, and user engagement.' },
  { _id: 's3', slug: 'software-development', icon: 'code', title: 'Software Development', summary: 'End-to-end software solutions that streamline operations and enhance productivity.' },
  { _id: 's4', slug: 'crm-erp-solutions', icon: 'database', title: 'CRM & ERP Solutions', summary: 'Connected systems that streamline operations and bring your business data together.' },
  { _id: 's5', slug: 'digital-marketing', icon: 'megaphone', title: 'Digital Marketing', summary: 'Grow your online presence through SEO, social media, content, and paid advertising.' },
  { _id: 's6', slug: 'it-consulting-support', icon: 'lifebuoy', title: 'IT Consulting & Support', summary: 'Expert guidance, technical support, and infrastructure management for any size of business.' },
];

export const fallbackProjects = [
  { _id: 'p1', slug: 'business-website-platform', title: 'Business Website Platform', category: 'Web Development', summary: 'A fast, SEO-ready corporate website with a custom CMS for easy content updates.', tags: ['React', 'Node.js', 'MongoDB'] },
  { _id: 'p2', slug: 'ecommerce-store', title: 'E-Commerce Store', category: 'E-Commerce', summary: 'Full online store with cart, payments, and an admin dashboard for order management.', tags: ['MERN', 'Stripe', 'Tailwind'] },
  { _id: 'p3', slug: 'inventory-management-system', title: 'Inventory Management System', category: 'Software', summary: 'A CRM/ERP-style system that unifies stock, sales, and reporting in one dashboard.', tags: ['Express', 'MongoDB', 'Charts'] },
  { _id: 'p4', slug: 'service-booking-app', title: 'Service Booking App', category: 'App Development', summary: 'Cross-platform mobile app for scheduling appointments with real-time availability.', tags: ['React Native', 'REST API'] },
];

export const serviceOptions = fallbackServices.map((s) => s.title).concat('E-Commerce Solution', 'Other');

// Fallback testimonials (mirror the seed data) — shown if the API is unreachable.
export const fallbackTestimonials = [
  {
    _id: 't1',
    name: 'Sujata Rana',
    role: 'Founder',
    company: 'Himalayan Handicrafts',
    quote:
      'NLCITS took our shop online in weeks, not months. The site is fast, easy to update ourselves, and orders have grown every month since launch.',
    rating: 5,
  },
  {
    _id: 't2',
    name: 'Bikash Shrestha',
    role: 'Operations Manager',
    company: 'Everest Logistics',
    quote:
      'The custom inventory system NLCITS built replaced three spreadsheets and a lot of guesswork. Their support after launch has been just as strong as the build itself.',
    rating: 5,
  },
  {
    _id: 't3',
    name: 'Anjali Gurung',
    role: 'Marketing Lead',
    company: 'Kathmandu Wellness Co.',
    quote:
      "Clear communication from day one, a design that actually matches our brand, and a team that genuinely cared about getting it right. Couldn't ask for more.",
    rating: 5,
  },
];

export const fallbackStats = [
  { value: 60, suffix: '+', label: 'Projects Delivered' },
  { value: 98, suffix: '%', label: 'Client Satisfaction' },
  { value: 5, suffix: '+', label: 'Years Building' },
  { value: 24, suffix: '/7', label: 'Support Availability' },
];

export const marqueeItems = [
  'React & Next.js',
  'Node.js & Express',
  'MongoDB & PostgreSQL',
  'React Native',
  'AWS & Cloud Hosting',
  'SEO & Digital Marketing',
  'CRM & ERP Systems',
  'UI/UX Design',
];

export const faqs = [
  {
    q: 'How long does a typical website project take?',
    a: 'Most business websites take 3–6 weeks from kickoff to launch, depending on scope. Custom software and larger platforms typically run 8–14 weeks. We\'ll give you a realistic timeline before any work begins.',
  },
  {
    q: 'Do you work with businesses outside Nepal?',
    a: "Yes — while we're based in Kathmandu, a significant share of our clients are international. We work across time zones and communicate over email, calls, and whichever tools you already use.",
  },
  {
    q: "What's included after a project launches?",
    a: 'Every project includes a post-launch support window for bug fixes. Beyond that, we offer ongoing maintenance packages covering updates, monitoring, backups, and small feature requests.',
  },
  {
    q: 'Can you help redesign an existing website or system?',
    a: "Absolutely. We regularly take over and modernize existing codebases — whether that's a visual refresh, a performance overhaul, or migrating to a more maintainable tech stack.",
  },
  {
    q: 'How do you handle pricing?',
    a: "Most projects are quoted as a fixed price based on a clear scope, so there are no surprises. For ongoing work or evolving projects, we can also work on a monthly retainer basis.",
  },
];
