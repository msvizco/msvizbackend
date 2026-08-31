# MSVIZ Backend

Express + Prisma + PostgreSQL API with JWT admin auth and Supabase Storage uploads.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for **Vercel** setup.

```bash
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev      # http://localhost:5000
```

Health: `GET /health` · API: `/api/*`
