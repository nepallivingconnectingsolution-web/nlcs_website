import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import Service from '../models/Service.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import Testimonial from '../models/Testimonial.js';
import Stat from '../models/Stat.js';

dotenv.config();

const services = [
  {
    title: 'Website Development',
    slug: 'website-development',
    icon: 'globe',
    order: 1,
    summary: 'Professional, responsive, and SEO-friendly websites tailored to your business needs.',
    description:
      'From marketing sites to complex web platforms, we build fast, accessible, and search-optimised websites that look great on every device and convert visitors into customers.',
    features: ['Responsive design', 'SEO foundations', 'CMS integration', 'Performance optimised'],
  },
  {
    title: 'App Development',
    slug: 'app-development',
    icon: 'smartphone',
    order: 2,
    summary: 'Custom Android and iOS applications built for performance, scalability, and engagement.',
    description:
      'We design and develop native and cross-platform mobile apps with clean UX, robust architecture, and the scalability to grow with your user base.',
    features: ['iOS & Android', 'Cross-platform', 'API integration', 'App Store deployment'],
  },
  {
    title: 'Software Development',
    slug: 'software-development',
    icon: 'code',
    order: 3,
    summary: 'End-to-end software solutions that streamline operations and enhance productivity.',
    description:
      'Bespoke software engineered around your workflows — from internal tools to customer-facing platforms — built to be reliable, secure, and maintainable.',
    features: ['Custom architecture', 'Secure by design', 'Automated testing', 'Ongoing support'],
  },
  {
    title: 'CRM & ERP Solutions',
    slug: 'crm-erp-solutions',
    icon: 'database',
    order: 4,
    summary: 'Connected systems that streamline operations and bring your business data together.',
    description:
      'Implement and customise CRM and ERP systems that unify sales, operations, and finance so your team works from a single source of truth.',
    features: ['Process automation', 'Unified data', 'Custom modules', 'Reporting & insights'],
  },
  {
    title: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: 'megaphone',
    order: 5,
    summary: 'Grow your online presence through SEO, social media, content, and paid advertising.',
    description:
      'Data-driven digital marketing that builds your brand and brings qualified traffic — combining SEO, social media, content, and paid campaigns.',
    features: ['SEO', 'Social media marketing', 'Content marketing', 'Paid advertising'],
  },
  {
    title: 'IT Consulting & Support',
    slug: 'it-consulting-support',
    icon: 'lifebuoy',
    order: 6,
    summary: 'Expert guidance, technical support, and infrastructure management for any size of business.',
    description:
      'Strategic technology consulting and dependable support — helping you choose the right stack, secure your systems, and keep everything running smoothly.',
    features: ['Technology strategy', 'Infrastructure management', 'Security', '24/7 support options'],
  },
];

const projects = [
  {
    title: 'Business Website Platform',
    slug: 'business-website-platform',
    category: 'Web Development',
    summary: 'A fast, SEO-ready corporate website with a custom CMS for easy content updates.',
    tags: ['React', 'Node.js', 'MongoDB'],
    featured: true,
    order: 1,
  },
  {
    title: 'E-Commerce Store',
    slug: 'ecommerce-store',
    category: 'E-Commerce',
    summary: 'Full online store with cart, payments, and an admin dashboard for order management.',
    tags: ['MERN', 'Stripe', 'Tailwind'],
    featured: true,
    order: 2,
  },
  {
    title: 'Inventory Management System',
    slug: 'inventory-management-system',
    category: 'Software',
    summary: 'A CRM/ERP-style system that unifies stock, sales, and reporting in one dashboard.',
    tags: ['Express', 'MongoDB', 'Charts'],
    featured: true,
    order: 3,
  },
  {
    title: 'Service Booking App',
    slug: 'service-booking-app',
    category: 'App Development',
    summary: 'Cross-platform mobile app for scheduling appointments with real-time availability.',
    tags: ['React Native', 'REST API'],
    featured: false,
    order: 4,
  },
];

const stats = [
  { label: 'Projects Delivered', value: 60, suffix: '+', order: 1 },
  { label: 'Client Satisfaction', value: 98, suffix: '%', order: 2 },
  { label: 'Years Building', value: 5, suffix: '+', order: 3 },
  { label: 'Support Availability', value: 24, suffix: '/7', order: 4 },
];

const testimonials = [
  {
    name: 'Sujata Rana',
    role: 'Founder',
    company: 'Himalayan Handicrafts',
    quote:
      'NLCITS took our shop online in weeks, not months. The site is fast, easy to update ourselves, and orders have grown every month since launch.',
    rating: 5,
    featured: true,
    order: 1,
  },
  {
    name: 'Bikash Shrestha',
    role: 'Operations Manager',
    company: 'Everest Logistics',
    quote:
      'The custom inventory system NLCITS built replaced three spreadsheets and a lot of guesswork. Their support after launch has been just as strong as the build itself.',
    rating: 5,
    featured: true,
    order: 2,
  },
  {
    name: 'Anjali Gurung',
    role: 'Marketing Lead',
    company: 'Kathmandu Wellness Co.',
    quote:
      "Clear communication from day one, a design that actually matches our brand, and a team that genuinely cared about getting it right. Couldn't ask for more.",
    rating: 5,
    featured: true,
    order: 3,
  },
];

const run = async () => {
  await connectDB();
  try {
    console.log('Seeding database…');

    await Service.deleteMany();
    await Service.insertMany(services);
    console.log(`✓ ${services.length} services seeded`);

    await Project.deleteMany();
    await Project.insertMany(projects);
    console.log(`✓ ${projects.length} projects seeded`);

    await Testimonial.deleteMany();
    await Testimonial.insertMany(testimonials);
    console.log(`✓ ${testimonials.length} testimonials seeded`);
    await Stat.deleteMany();
    await Stat.insertMany(stats);
    console.log(`✓ ${stats.length} stats seeded`);

    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nlcsitservice.com').toLowerCase();
    const existing = await User.findOne({ email: adminEmail });
    if (!existing) {
      await User.create({
        name: process.env.ADMIN_NAME || 'NLCS Super Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
        role: 'superadmin',
      });
      console.log(`✓ Super admin created: ${adminEmail}`);
    } else {
      // Ensure the seeded account is a superadmin.
      if (existing.role !== 'superadmin') {
        existing.role = 'superadmin';
        await existing.save();
        console.log(`✓ Existing user promoted to super admin: ${adminEmail}`);
      } else {
        console.log(`• Super admin already exists: ${adminEmail}`);
      }
    }

    console.log('✓ Seed complete.');
    process.exit(0);
  } catch (err) {
    console.error(`✗ Seed failed: ${err.message}`);
    process.exit(1);
  }
};

run();
