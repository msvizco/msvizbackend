# MSVIZ Backend

Express + Prisma + PostgreSQL API with JWT admin auth and Supabase Storage uploads.

See the root [README](../README.md) for full setup.

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

API: http://localhost:5000  
Health: http://localhost:5000/health
