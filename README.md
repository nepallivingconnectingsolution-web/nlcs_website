# NLCS — MERN Website

Production-grade website for **Nepal Living Connecting Solution (NLCS) Pvt. Ltd.**, built with the MERN stack (MongoDB · Express · React · Node).

- **`server/`** — Express + MongoDB REST API (contacts, services, projects, admin auth)
- **`client/`** — React + Vite frontend (Home, Services, Projects, About, Contact)

---

## Features

**Admin control panel** (`/admin`)
- Secure login (JWT) with a role-based control panel
- **Dashboard** — live counts (enquiries, services, projects, users) + recent enquiries
- **Enquiries** — view messages, change status (new/read/replied/archived), delete, reply by email
- **Services** — full create/edit/delete, ordering, show/hide, features
- **Projects** — full create/edit/delete, categories, tags, featured flag, show/hide
- **Users & roles** — super admin manages all accounts (create/edit/deactivate/delete, assign roles)

### Roles

| Role | Can do |
|---|---|
| **Super Admin** | Everything — full control of content, enquiries, **and** all user accounts/roles |
| **Admin** | Manage content (services, projects) and enquiries; manage editor accounts |
| **Editor** | Limited content access |

Safeguards built in: you can't delete or deactivate your own account, you can't demote/delete the **last** super admin, and no one can grant a role higher than their own.

**Frontend (public site)**
- React 18 + Vite, client-side routing (React Router)
- Fully responsive, original design with an animated "connecting nodes" hero
- Pages: Home, Services, Projects (with category filter), About, Contact, 404
- Working contact form that posts to the API, with validation and success/error states
- Services and projects fetched from the API, with static fallback so the UI always renders
- Zero icon-font dependency (inline SVG icon set); respects `prefers-reduced-motion`

**Backend**
- REST API with Express, Mongoose models, controllers, and route-level validation
- Security: Helmet, CORS allow-list, rate limiting, `express-mongo-sanitize`, `hpp`, compression
- Contact submissions saved to MongoDB + optional email notification (Nodemailer)
- JWT admin authentication (bcrypt-hashed passwords) for managing content and enquiries
- Centralized error handling and a database seed script

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

# 3. Seed the database (services, sample projects, admin user)
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

Base URL: `http://localhost:5000/api`

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
| POST | `/auth/login` | Public | Admin login → returns JWT |
| GET | `/auth/me` | Admin | Current admin profile |
| GET | `/dashboard/stats` | Admin | Totals + recent enquiries |
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
- Host the API (Render, Railway, a VPS, etc.) with your production `MONGO_URI` and a strong `JWT_SECRET`.
- Host `client/dist` as static files (Netlify, Vercel, Nginx) and set `VITE_API_URL` to your API origin before building.
- Set `CLIENT_URL` on the server to your deployed frontend origin so CORS allows it.

---

## Project structure

```
nlcs-mern/
├── package.json            # root scripts (dev, seed, build)
├── server/
│   ├── server.js           # app entry + middleware
│   ├── config/db.js        # Mongo connection
│   ├── models/             # Contact, Service, Project, User
│   ├── controllers/        # business logic
│   ├── routes/             # express routers + validation
│   ├── middleware/         # auth, errors, validation
│   ├── utils/              # email, JWT
│   └── seed/seed.js        # database seeding
└── client/
    ├── vite.config.js
    └── src/
        ├── main.jsx, App.jsx, index.css
        ├── api/axios.js
        ├── hooks/useFetch.js
        ├── data/content.js
        ├── components/      # Navbar, Footer, Hero, Cards, Icon…
        └── pages/           # Home, Services, Projects, About, Contact, NotFound
```

---

## Security checklist before going live

- [ ] Set a long, random `JWT_SECRET`
- [ ] Change the seeded admin password
- [ ] Use a MongoDB user with least privilege
- [ ] Serve everything over HTTPS
- [ ] Lock `CLIENT_URL` / `CORS` to your real domain
- [ ] Configure SMTP credentials for contact notifications

© 2026 Nepal Living Connecting Solution Pvt. Ltd.
