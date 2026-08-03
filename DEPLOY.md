# Deploying to the Hostinger VPS

Scope: this app is a contact-form/CMS company site — Express + MongoDB API, static React frontend, SMTP email, local-disk image uploads via multer/sharp. No Redis, no payment gateway, no OTP, no Cloudinary — none of that is in the codebase, so don't provision for it.

Layout on the VPS:
- `nlcsitservice.com` → nginx serves the static `client/dist` build
- `api.nlcsitservice.com` → nginx reverse-proxies to the Node API (PM2, port 5000)
- MongoDB runs on the same box, bound to `127.0.0.1` (not exposed publicly)

These steps are for you to run over SSH — this assistant has no VPS access and can only prepare the files in this repo.

## One-time server setup

1. Install Node (match your local version — currently v24.x), nginx, certbot, and MongoDB on the VPS.
2. Confirm MongoDB is bound to localhost only: in `/etc/mongod.conf`, `net.bindIp` should be `127.0.0.1`. Restart `mongod` if you change it.
3. Install PM2 globally: `npm install -g pm2`.
4. Copy `deploy/nginx/api.nlcsitservice.com.conf` and `deploy/nginx/nlcsitservice.com.conf` into `/etc/nginx/sites-available/`, symlink both into `sites-enabled/`.
5. Point both domains' DNS A records at the VPS IP, then run `certbot --nginx -d nlcsitservice.com -d www.nlcsitservice.com` and `certbot --nginx -d api.nlcsitservice.com` to provision TLS certs (certbot will rewrite the `listen 80` blocks — that's expected).
6. `nginx -t && systemctl reload nginx`.

## First deploy

1. Clone this repo onto the VPS, e.g. to `/var/www/nlcsitservice.com`.
2. `npm run install:all` (installs both `server/` and `client/` deps).
3. `cp server/.env.production.example server/.env` and fill in `JWT_SECRET` (generate one, see the comment in the file), `ADMIN_PASSWORD`, and SMTP credentials. Leave `MONGO_URI` as `mongodb://localhost:27017/nlcs_db` since Mongo is on the same box.
4. `npm run seed --prefix server` — creates the super-admin account. Do this once; re-running is safe but change `ADMIN_PASSWORD` afterward via the admin panel rather than re-seeding.
5. `npm run build` (from repo root) — builds `client/dist`. Nginx's `root` in `deploy/nginx/nlcsitservice.com.conf` must point at this path (adjust if you cloned somewhere other than `/var/www/nlcsitservice.com`).
6. Start the API: `pm2 start server/ecosystem.config.cjs && pm2 save && pm2 startup` (follow the printed instructions so PM2 survives a reboot).
7. Visit `https://nlcsitservice.com` and `https://api.nlcsitservice.com/api/health` to confirm both are up.

## Redeploys

```bash
git pull
npm run install:all
npm run build
pm2 restart nlcs-api
```

No `pm2 restart` is needed for frontend-only changes — nginx serves the new `client/dist` immediately after the build.

## Also do (from the README's pre-launch checklist)

The main `README.md` "Security checklist before going live" and "Deployment notes" sections still apply — in particular, double-check `CLIENT_URL` in `server/.env` matches the real frontend origin, and use a least-privilege MongoDB user rather than running the app against an admin account.
