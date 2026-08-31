import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

async function start() {
  const app = createApp();

  try {
    await prisma.$connect();
    console.log('PostgreSQL connected');
  } catch (error) {
    console.error('Failed to connect to PostgreSQL', error);
    process.exit(1);
  }

  app.listen(env.port, () => {
    console.log(`MSVIZ API running on http://localhost:${env.port}`);
  });
}

if (!process.env.VERCEL) {
  start().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
