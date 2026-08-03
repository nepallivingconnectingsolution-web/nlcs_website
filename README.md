# NLCS — MERN Website

Production-grade website for **Nepal Living Connecting Solution (NLCS) Pvt. Ltd.**, built with the MERN stack (MongoDB · Express · React · Node).

- **`server/`** — Express + MongoDB REST API (contacts, services, projects, testimonials, newsletter, uploads, admin auth)
- **`client/`** — React + Vite frontend (Home, Services, Projects, About, Contact) with a 3D hero, motion design, and an admin control panel

---

## Features

**Frontend (public site)**
- React 18 + Vite, client-side routing (React Router 7), lazy-loaded routes
- **3D interactive hero** — React Three Fiber node-network scene with mouse parallax and auto-rotation, gracefully falling back to a lightweight 2D canvas on low-power devices, small screens, or `prefers-reduced-motion`
- Framer Motion throughout: animated page transitions, an animated nav "pill" indicator, a motion mobile drawer, 3D tilt cards, a magnetic CTA/social-icon effect, scroll-reveals, animated stat counters, and a scroll-progress bar
- New content sections: capability marquee, animated stats band, testimonials (live from the API with static fallback), FAQ accordion
- Custom cursor (desktop only), skeleton loaders, toast notifications (`react-hot-toast`)
- SEO: per-page `<title>`/meta/Open Graph via `react-helmet-async`, JSON-LD Organization schema, `sitemap.xml` / `robots.txt`, generated OG/social-share image
- Fully responsive, mobile-first; zero icon-font dependency (inline SVG icon set)
- Working contact form (with a live map embed) and a working footer newsletter signup, both posting to the API

**Admin control panel** (`/admin`)
- Secure login (JWT) with a role-based control panel
- **Dashboard** — live counts + two charts (enquiries per day, most-requested services) via Recharts, fed by `/api/dashboard/analytics`
- **Enquiries** — view messages, change status, delete, reply by email
- **Services** — full create/edit/delete, ordering, show/hide, features
- **Projects** — full create/edit/delete, categories, tags, featured flag, an image-upload widget
- **Testimonials** — full create/edit/delete, avatar upload, featured flag (drives the homepage testimonials section)
- **Newsletter** — paginated subscriber list with CSV export
- **Users & roles** — super admin manages all accounts (create/edit/deactivate/delete, assign roles)

### Roles

| Role | Can do |
|---|---|
| **Super Admin** | Everything — full control of content, enquiries, **and** all user accounts/roles |
| **Admin** | Manage content (services, projects, testimonials) and enquiries; manage editor accounts |
| **Editor** | Limited content access |

Safeguards built in: you can't delete or deactivate your own account, you can't demote/delete the **last** super admin, and no one can grant a role higher than their own.

**Backend**
- REST API with Express, Mongoose models, controllers, and route-level validation
- Image uploads: Multer (memory storage) → Sharp (resize + re-encode to WebP) → served from `/uploads`, with a 5MB / image-type limit
- Security: Helmet (with a locked-down CSP), CORS allow-list, tiered rate limiting (global, contact form, newsletter, and a strict one on login), `express-mongo-sanitize`, `hpp`, compression, per-request IDs for log correlation
- Interactive API docs at `/api/docs` (Swagger UI), raw spec at `/api/openapi.json`
- Contact submissions saved to MongoDB + optional email notification (Nodemailer)
- JWT admin authentication (bcrypt-hashed passwords) for managing content and enquiries
- Graceful shutdown (SIGTERM/SIGINT), centralized error handling, and a database seed script

---

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

---

## Quick start

```bash
# 1. Install dependencies (root, server, and client)
npm install
npm run install:all

# 2. Configure environment variables
cp server/.env.example server/.env      # then edit values (MONGO_URI, JWT_SECRET, SMTP…)
cp client/.env.example client/.env      # leave VITE_API_URL empty for local dev

# 3. Seed the database (services, sample projects, testimonials, admin user)
npm run seed

# 4. Run both apps together (API on :5000, client on :5173)
npm run dev
```

Then open **http://localhost:5173**.

> The Vite dev server proxies `/api` to `http://localhost:5000`, so no CORS setup is needed in development.

### Run apps individually

```bash
npm run server   # API only (nodemon)
npm run client   # frontend only
```

---

## Environment variables (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | API port (default 5000) |
| `CLIENT_URL` | Allowed CORS origin(s), comma-separated |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing admin tokens |
| `JWT_EXPIRES_IN` | Token lifetime (e.g. `7d`) |
| `ADMIN_NAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seed admin credentials |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` | Email server (leave `SMTP_HOST` empty to disable sending — contacts are still saved) |
| `MAIL_FROM` / `MAIL_TO` | From and notification recipient addresses |

---

## API reference

Base URL: `http://localhost:5000/api` — full interactive docs at `http://localhost:5000/api/docs`.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/health` | Public | Health check |
| POST | `/contacts` | Public | Submit an enquiry (rate-limited) |
| GET | `/contacts` | Admin | List enquiries (paginated) |
| PATCH | `/contacts/:id` | Admin | Update enquiry status |
| DELETE | `/contacts/:id` | Admin | Delete an enquiry |
| GET | `/services` | Public | List active services |
| GET | `/services/:slug` | Public | Single service |
| POST/PUT/DELETE | `/services...` | Admin | Manage services |
| GET | `/projects` | Public | List projects (`?featured=true`, `?category=`) |
| GET | `/projects/:slug` | Public | Single project |
| POST/PUT/DELETE | `/projects...` | Admin | Manage projects |
| GET | `/testimonials` | Public | List active testimonials (`?featured=true`) |
| GET | `/testimonials/all` | Admin | List all testimonials |
| POST/PUT/DELETE | `/testimonials...` | Admin | Manage testimonials |
| POST | `/newsletter` | Public | Subscribe an email (rate-limited) |
| POST | `/newsletter/unsubscribe` | Public | Unsubscribe an email |
| GET | `/newsletter` | Admin | List subscribers (paginated) |
| POST | `/uploads` | Admin/Editor | Upload + optimize an image (`multipart/form-data`, field `image`) → `{ url }` |
| POST | `/auth/login` | Public | Admin login → returns JWT (rate-limited) |
| GET | `/auth/me` | Admin | Current admin profile |
| GET | `/dashboard/stats` | Admin | Totals + recent enquiries |
| GET | `/dashboard/analytics` | Admin | Enquiries per day + by requested service (`?days=`) |
| GET | `/users` | Super Admin / Admin | List users |
| POST | `/users` | Super Admin / Admin | Create user |
| PUT | `/users/:id` | Super Admin / Admin | Update user (name, role, status, password) |
| DELETE | `/users/:id` | Super Admin | Delete user |

Admin requests send `Authorization: Bearer <token>`.

### Accessing the control panel

After seeding, open **http://localhost:5173/admin/login** and sign in with the super-admin credentials from `server/.env` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). From there the super admin can create additional admins and editors under **Users & roles**.

---

## Production build

```bash
# Build the frontend (outputs to client/dist)
npm run build

# Start the API in production
NODE_ENV=production npm start
```

**Deployment notes**
- For the Hostinger VPS setup (`nlcsitservice.com` + `api.nlcsitservice.com` on the same box, PM2 + nginx + self-hosted MongoDB), see **[`DEPLOY.md`](./DEPLOY.md)** and the nginx configs in **[`deploy/nginx/`](./deploy/nginx/)** — those are the concrete artifacts for this project's actual scope (no Redis, payments, OTP, or Cloudinary).
- Host the API (Render, Railway, a VPS, etc.) with your production `MONGO_URI` and a strong `JWT_SECRET`.
- Host `client/dist` as static files (Netlify, Vercel, Nginx) and set `VITE_API_URL` to your API origin before building.
- Set `CLIENT_URL` on the server to your deployed frontend origin so CORS allows it.
- `server/uploads` is written to local disk — on most PaaS hosts (Render, Railway, Heroku-style) this disk is **ephemeral**, meaning uploaded images are lost on redeploy. For production, either mount a persistent volume at `server/uploads`, or swap the `middleware/upload.js` destination for an object store (S3, Cloudinary, R2) — the multer→sharp pipeline is already isolated there, so only that one file needs to change.
- Update the hard-coded site URL (`https://nlcsitservice.com`) in `client/src/components/SEO.jsx`, `OrganizationJsonLd.jsx`, `public/sitemap.xml`, `public/robots.txt`, and `index.html` if the production domain differs.
- Regenerate `public/og-image.png` / `public/logo.png` if you update the brand mark (sources are simple SVG → rasterized with `sharp`; see git history for the generation script).

---

## Project structure

```
nlcs-mern/
├── package.json            # root scripts (dev, seed, build)
├── DEPLOY.md               # Hostinger VPS deployment runbook
├── deploy/nginx/           # nginx site configs (api + static client)
├── server/
│   ├── server.js           # app entry + middleware
│   ├── config/db.js        # Mongo connection
│   ├── docs/openapi.js     # hand-written OpenAPI spec (served at /api/docs)
│   ├── models/             # Contact, Service, Project, Testimonial, Newsletter, User
│   ├── controllers/        # business logic
│   ├── routes/             # express routers + validation
│   ├── middleware/         # auth, errors, validation, upload (multer+sharp), request id
│   ├── utils/               # email, JWT
│   ├── uploads/             # optimized images written here at runtime (gitignored)
│   └── seed/seed.js        # database seeding
└── client/
    ├── vite.config.js       # includes manual vendor chunking (three/recharts/motion/react)
    └── src/
        ├── main.jsx, App.jsx, index.css, admin.css
        ├── api/axios.js
        ├── hooks/useFetch.js
        ├── data/content.js
        ├── components/      # Navbar, Footer, Hero3D/HeroScene, TiltCard, Magnetic,
        │                     # Marquee, StatsCounter, Testimonials, FAQAccordion, SEO…
        │   └── admin/        # AdminLayout, ImageUploadField, Modal, ProtectedRoute
        └── pages/            # Home, Services, Projects, About, Contact, NotFound
            └── admin/        # Dashboard, Enquiries, AdminServices/Projects/Testimonials/Newsletter/Users
```

---

## Security checklist before going live

- [ ] Set a long, random `JWT_SECRET`
- [ ] Change the seeded admin password
- [ ] Use a MongoDB user with least privilege
- [ ] Serve everything over HTTPS
- [ ] Lock `CLIENT_URL` / `CORS` to your real domain
- [ ] Configure SMTP credentials for contact notifications
- [ ] Point `server/uploads` at persistent storage (see deployment notes above)

© 2026 Nepal Living Connecting Solution Pvt. Ltd.
