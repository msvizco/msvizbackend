# Vercel — MSVIZ Backend

## Deploy

1. Import `msvizco/msvizbackend` in [Vercel](https://vercel.com/new)
2. Framework preset: **Other**
3. Root directory: `.` (repository root)
4. Vercel reads `vercel.json` automatically

## Environment variables

Set in **Vercel → Project → Settings → Environment variables**:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Use a **pooled** Postgres URL in production |
| `JWT_SECRET` | Yes | Long random string |
| `SUPABASE_URL` | Yes | For image uploads |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only |
| `SUPABASE_STORAGE_BUCKET` | Yes | e.g. `msviz-images` |
| `FRONTEND_URL` | Yes | Cloudflare Pages URL |
| `ALLOWED_ORIGINS` | Yes | Same URL(s), comma-separated |
| `NODE_ENV` | Auto | Set to `production` on Vercel |

Example:

```
FRONTEND_URL=https://msviz.pages.dev
ALLOWED_ORIGINS=https://msviz.pages.dev,https://www.msviz.com
DATABASE_URL=postgresql://...pooler.../postgres?pgbouncer=true
```

## Database

Run migrations against production Postgres **before** or **after** first deploy:

```bash
npx prisma migrate deploy
npm run seed   # optional, first-time only
```

Use Supabase, Neon, or Railway Postgres. Prefer the **connection pooler** URL for serverless.

## API routes

All traffic is routed to the Express app via `api/index.ts`:

- Health: `GET /health`
- API: `GET /api/...`

## Limits

- Serverless function timeout: 30s (configured in `vercel.json`)
- Request body limit: ~4.5 MB on Hobby (keep uploads under `MAX_FILE_SIZE_MB`)
- In-memory rate limiting is disabled on Vercel (use Cloudflare or Upstash if needed)

## Local vs Vercel

- **Local:** `npm run dev` → runs `src/server.ts` with `app.listen()`
- **Vercel:** `api/index.ts` exports the Express app as a serverless handler
