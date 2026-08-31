import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env, getMissingEnvVars } from './config/env';
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
  app.get('/health', (_req: Request, res: Response) => {
    const missing = getMissingEnvVars();
    res.status(missing.length ? 503 : 200).json({
      success: missing.length === 0,
      service: 'msviz-api',
      status: missing.length ? 'misconfigured' : 'ok',
      env: env.isVercel ? 'vercel' : 'node',
      ...(missing.length ? { missing } : {}),
    });
  });

  const envGate = (_req: Request, res: Response, next: () => void) => {
    const missing = getMissingEnvVars();
    if (missing.length) {
      return res.status(503).json({
        success: false,
        message: `Server misconfigured. Set: ${missing.join(', ')}`,
      });
    }
    next();
  };

  // /api/* — canonical paths
  app.use('/api', envGate, apiLimiter, routes);
  // /* — legacy paths when frontend VITE_API_URL omits /api suffix
  app.use(envGate, apiLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
