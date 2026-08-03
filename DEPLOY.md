# Deploying to the Hostinger VPS (alongside the existing CRM)

This VPS (`187.127.153.218`) already runs the `star-job-crm-main` stack (Django CRM,
Postgres, Redis, Celery) behind a single `nginx` Docker container that owns ports
80/443, currently serving `sjcrm.nlcsitservice.com`. This guide adds the NLCS
website (`nlcsitservice.com` + `api.nlcsitservice.com`) as a **separate, isolated**
Docker stack, sharing only the nginx container as an entry point. The CRM's own
containers, database, and config are never modified except for one additive edit
(step 4).

Scope check: this app is a contact-form/CMS company site — Node/Express + MongoDB
+ static React build + SMTP. No Redis, no payment gateway, no OTP, no Cloudinary —
none of that exists in the codebase, so don't provision for it.

All of this happens over SSH/the VPS terminal — this assistant has no VPS access
and can only prepare the files in this repo.

---

## 1. Point DNS at the VPS

In Hostinger hPanel → Domains → `nlcsitservice.com` → DNS Zone, add A records:

| Type | Name | Points to |
|---|---|---|
| A | `@` | `187.127.153.218` |
| A | `www` | `187.127.153.218` |
| A | `api` | `187.127.153.218` |

(`sjcrm` should already exist — leave it as-is.) DNS can take a few minutes to
propagate; the rest of the steps can proceed while you wait, but certbot (step 9)
needs it to have resolved.

## 2. Back up the CRM's config before touching anything

```bash
cd /home/nlcits/star-job-crm-main
cp docker-compose.prod.yml docker-compose.prod.yml.bak
cp deploy/nginx.conf deploy/nginx.conf.bak
```

If anything goes wrong later, restoring is just `cp *.bak` back over the originals
followed by `docker compose -f docker-compose.prod.yml up -d` and an nginx reload.

## 3. Create the shared Docker network

```bash
docker network create nlcs_shared
```

## 4. Attach the CRM's nginx container to that network (the one CRM edit)

Open the compose file:

```bash
nano /home/nlcits/star-job-crm-main/docker-compose.prod.yml
```

Find the `nginx:` service block. Add one new volume line and a `networks:` list
to it (everything else in that block — `image`, `ports`, `depends_on`, the
existing volumes — stays exactly as-is):

```yaml
  nginx:
    image: nginx:latest
    container_name: star-job-crm-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /data/star-jobs-crm/media:/usr/share/nginx/html/media
      - ./deploy/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./deploy/certbot/www:/var/www/certbot
      - ./deploy/certbot/conf:/etc/letsencrypt
      - /home/nlcits/nlcs-website/client/dist:/usr/share/nginx/html/nlcs:ro   # NEW
    depends_on:
      - web
    restart: always
    networks:            # NEW
      - default           # NEW
      - nlcs_shared        # NEW
```

Then add this as a new top-level section, at the very bottom of the file
(same indent level as `services:` and `volumes:`, not nested inside them):

```yaml
networks:
  nlcs_shared:
    external: true
```

Save (in `nano`: `Ctrl+O`, Enter, then `Ctrl+X` to exit).

Apply just this change to the nginx container (does not touch `web`, `db`,
`redis`, or the celery containers):

```bash
cd /home/nlcits/star-job-crm-main
docker compose -f docker-compose.prod.yml up -d nginx
```

## 5. Get the NLCS code onto the VPS

```bash
cd /home/nlcits
git clone https://github.com/nepallivingconnectingsolution-web/nlcs_website.git nlcs-website
cd nlcs-website
```

(This path — `/home/nlcits/nlcs-website/client/dist` — is what step 4's volume
mount and this repo's `docker-compose.prod.yml` both assume. If you clone
somewhere else, update both to match.)

## 6. Configure the API's environment

```bash
cp server/.env.production.example server/.env
nano server/.env
```

Fill in `JWT_SECRET` (generate one: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` — or just use `openssl rand -hex 48` if Node isn't on the host path) and `ADMIN_PASSWORD`. Leave `MONGO_URI` as `mongodb://nlcs-mongo:27017/nlcs_db` — that's the Docker service name from `docker-compose.prod.yml`, resolved automatically once the containers are on the same network. Add SMTP credentials if you want contact-form email notifications (optional).

## 7. Build the frontend

```bash
docker run --rm -v $(pwd)/client:/app -w /app node:22-alpine sh -c \
  "npm ci && VITE_API_URL=https://api.nlcsitservice.com npm run build"
```

This builds `client/dist` using a throwaway Node container — no need to install
Node on the host. `VITE_API_URL` must be set at build time so the deployed site
calls the right API origin.

## 8. nginx phase 1 — HTTP-only, so certbot can verify domain ownership

```bash
cat /home/nlcits/nlcs-website/deploy/nginx/phase1-http-only.conf >> /home/nlcits/star-job-crm-main/deploy/nginx.conf
```

Test the config is valid, then reload (not restart) nginx:

```bash
docker exec star-job-crm-nginx nginx -t
docker exec star-job-crm-nginx nginx -s reload
```

If `nginx -t` reports an error, **do not reload** — fix the file first (it's
just plain text at `/home/nlcits/star-job-crm-main/deploy/nginx.conf`) or
restore from the `.bak` copy made in step 2.

Confirm it's live: `curl http://nlcsitservice.com` should return the
"certificate setup in progress" placeholder text.

## 9. Get TLS certificates

```bash
cd /home/nlcits/star-job-crm-main
docker run --rm \
  -v $(pwd)/deploy/certbot/www:/var/www/certbot \
  -v $(pwd)/deploy/certbot/conf:/etc/letsencrypt \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d nlcsitservice.com -d www.nlcsitservice.com

docker run --rm \
  -v $(pwd)/deploy/certbot/www:/var/www/certbot \
  -v $(pwd)/deploy/certbot/conf:/etc/letsencrypt \
  certbot/certbot certonly --webroot -w /var/www/certbot \
  -d api.nlcsitservice.com
```

Each should end with "Successfully received certificate" and show where it
saved the cert (matches the paths phase 2 expects).

## 10. nginx phase 2 — swap in the full config with SSL

Open the file and **delete the phase-1 blocks you added in step 8** (the two
`server { listen 80; ... }` blocks for `nlcsitservice.com`/`www` and
`api.nlcsitservice.com` — leave the CRM's `sjcrm.nlcsitservice.com` blocks
untouched):

```bash
nano /home/nlcits/star-job-crm-main/deploy/nginx.conf
```

Then append the final version:

```bash
cat /home/nlcits/nlcs-website/deploy/nginx/phase2-full.conf >> /home/nlcits/star-job-crm-main/deploy/nginx.conf
```

Test and reload again:

```bash
docker exec star-job-crm-nginx nginx -t
docker exec star-job-crm-nginx nginx -s reload
```

## 11. Start the NLCS containers

```bash
cd /home/nlcits/nlcs-website
docker network create nlcs_shared 2>/dev/null || true   # no-op if it already exists from step 3
docker compose -f docker-compose.prod.yml up -d --build
```

## 12. Seed the database (first deploy only)

```bash
docker exec -it nlcs-api node seed/seed.js
```

Creates the super-admin account from `ADMIN_EMAIL`/`ADMIN_PASSWORD` in
`server/.env`. Don't re-run this on later deploys — change the password via
the admin panel instead.

## 13. Verify

- `https://nlcsitservice.com` — the site
- `https://api.nlcsitservice.com/api/health` — should return `{"success":true,...}`
- `https://sjcrm.nlcsitservice.com` — confirm the CRM is unaffected

---

## Redeploys

```bash
cd /home/nlcits/nlcs-website
git pull

# Rebuild frontend
docker run --rm -v $(pwd)/client:/app -w /app node:22-alpine sh -c \
  "npm ci && VITE_API_URL=https://api.nlcsitservice.com npm run build"

# Rebuild + restart the API
docker compose -f docker-compose.prod.yml up -d --build nlcs-api
```

No nginx reload needed for either — nginx reads `client/dist` straight off disk,
and `nlcs-api` changes don't touch nginx's config.

## Also do (from the README's pre-launch checklist)

The main `README.md` "Security checklist before going live" and "Deployment
notes" sections still apply — a least-privilege MongoDB user is less critical
here since `nlcs-mongo` isn't exposed outside the Docker network, but the rest
(`JWT_SECRET`, `CLIENT_URL`, HTTPS, SMTP) still matter.
