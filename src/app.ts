import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env';
import routes from './routes';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFound } from './middleware/errorHandler';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );
  app.use(
    cors({
      origin: env.allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use('/api', apiLimiter, routes);

  app.get('/health', (_req, res) => {
    res.json({ success: true, service: 'msviz-api', status: 'ok', env: env.isVercel ? 'vercel' : 'node' });
  });

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
