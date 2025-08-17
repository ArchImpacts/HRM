# ARCH Impacts — Production Runbook (v4.2)
Generated 2025-08-09T12:32:57.534318Z

1) `cp .env.example .env.local` and fill values
2) `npm i && npx prisma migrate deploy && npm run dev`
3) Deploy to Vercel; set env vars; add cron for `GET /api/cron/dispatch`
4) Clerk setup: set publishable & secret keys; visit `/admin/bootstrap` to promote your admin
