import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { scopePerRequest } from 'awilix-express';
import { container } from './container.js';
import { AppError } from './shared/errors.js';

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use(scopePerRequest(container));

  // Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
      });
    }

    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err,
      });
    }

    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
