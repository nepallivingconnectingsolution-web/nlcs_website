# Deploying to the Hostinger VPS (alongside the existing CRM)

This VPS (`187.127.153.218`) already runs the `star-job-crm-main` stack (Django CRM,
Postgres, Redis, Celery) behind a single `nginx` Docker container that owns ports
80/443, currently serving `sjcrm.nlcsitservice.com`. This guide adds the NLCS
website (`nlcsitservice.com`) as a **separate, isolated** Docker stack, sharing
only the nginx container as an entry point. The CRM's own containers, database,
and config are never modified except for one additive edit (step 4).

The API is served from the **same domain** under `/api/` and `/uploads/`
(path-based routing), not from a separate `api.nlcsitservice.com` subdomain —
that subdomain's DNS got stuck propagating on Hostinger's side (confirmed via
independent public resolvers, not just local caching) and going through their
support was the slower path, so this routes around it entirely using the
domain that's already working. No extra DNS record or cert is needed for it.

Scope check: this app is a contact-form/CMS company site — Node/Express + MongoDB
+ static React build + SMTP. No Redis, no payment gateway, no OTP, no Cloudinary —
none of that exists in the codebase, so don't provision for it.

All of this happens over SSH/the VPS terminal — this assistant has no VPS access
and can only prepare the files in this repo.

---

## 1. Point DNS at the VPS

In Hostinger hPanel → Domains → `nlcsitservice.com` → DNS Zone, add A and AAAA
records for the apex and `www` (the VPS's IPv6 is `2a02:4780:63:9668::1` —
check with `ip -6 addr show scope global` if it's ever different):

| Type | Name | Points to |
|---|---|---|
| A | `@` | `187.127.153.218` |
| AAAA | `@` | `2a02:4780:63:9668::1` |
| A | `www` | `187.127.153.218` (only needed if `www` isn't already a CNAME to `@`) |

(`sjcrm` should already exist — leave it as-is.) Add **both** A and AAAA for
the apex — if only one is set and the other still points at Hostinger's
default/parking address from before, IPv6-preferring clients (including
Let's Encrypt's validation servers) will hit the wrong place. No `api` record
needed — see the note above about serving the API from this same domain.

DNS can take anywhere from a couple minutes to over an hour to propagate on
Hostinger; the rest of the steps can proceed while you wait, but certbot
(step 9) needs it to have resolved. If a *newly created* record (not an edit
to an existing one) seems stuck for over 30-45 minutes even after checking via
an independent public resolver (e.g. `https://cloudflare-dns.com/dns-query?name=YOURDOMAIN&type=A`
with header `accept: application/dns-json`) — not just the VPS's own cache —
try deleting and re-adding it before waiting further; if it's still stuck,
that's a Hostinger-side issue worth contacting their support about.

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
docker run --rm -v $(pwd)/client:/app -w /app node:22-alpine npm ci
docker run --rm -v $(pwd)/client:/app -w /app node:22-alpine npm run build
```

This builds `client/dist` using a throwaway Node container — no need to install
Node on the host. **Deliberately leave `VITE_API_URL` unset** — the client then
calls relative `/api` paths, which land on the same origin nginx serves the
site from (see step 10), avoiding the stuck `api.` subdomain entirely.

(Run as two separate commands, not chained with `&&` inside a quoted `sh -c`
string — some browser-based terminals mangle pasted commands containing
quotes/ampersands, silently corrupting them.)

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

This VPS already has a working script for this (`deploy/05-obtain-ssl-cert.sh`,
used to get the `sjcrm` cert) — it issues one cert per domain, so run it twice
(no `api.` cert needed — see the note at the top of this file). Replace
`you@example.com` with a real email you want Let's Encrypt renewal notices
sent to:

```bash
cd /home/nlcits/star-job-crm-main
./deploy/05-obtain-ssl-cert.sh nlcsitservice.com you@example.com
./deploy/05-obtain-ssl-cert.sh www.nlcsitservice.com you@example.com
```

Each should end with "Certificate obtained for ..." and print next-step
instructions — **ignore those printed instructions** (they're generic for this
script and assume a single-site nginx.conf); follow step 10 below instead,
which accounts for this being a shared nginx serving multiple sites.

## 10. nginx phase 2 — swap in the full config with SSL

Open the file and **delete the phase-1 block you added in step 8** (the
`server { listen 80; ... }` block for `nlcsitservice.com`/`www` — leave the
CRM's `sjcrm.nlcsitservice.com` blocks untouched):

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
- `https://nlcsitservice.com/api/health` — should return `{"success":true,...}`
- `https://sjcrm.nlcsitservice.com` — confirm the CRM is unaffected

---

## Redeploys

```bash
cd /home/nlcits/nlcs-website
git pull

# Rebuild frontend (VITE_API_URL deliberately left unset — see step 7)
docker run --rm -v $(pwd)/client:/app -w /app node:22-alpine npm ci
docker run --rm -v $(pwd)/client:/app -w /app node:22-alpine npm run build

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
