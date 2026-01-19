/**
 * Express Application Factory
 *
 * Creates and configures the Express app with:
 * - JSON body parsing
 * - Health check endpoint
 * - Feature route mounting
 * - Error handling middleware
 */

import express, { type Express, type Request, type Response, type NextFunction } from 'express';
import { AppError } from './shared/errors.js';

// Feature routes
import { repRoutes } from './reps/repRoutes.js';
import { productRoutes } from './products/productRoutes.js';
import { fulfillmentRoutes } from './fulfillments/fulfillmentRoutes.js';
import { orderRoutes } from './orders/orderRoutes.js';

/**
 * Creates a configured Express application instance.
 * This factory pattern allows easy testing without starting a server.
 */
export function createApp(): Express {
  const app = express();

  // ---------------------------------------------------------------------------
  // Middleware
  // ---------------------------------------------------------------------------

  app.use(express.json());

  // ---------------------------------------------------------------------------
  // Health Check
  // ---------------------------------------------------------------------------

  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ---------------------------------------------------------------------------
  // Feature Routes
  // ---------------------------------------------------------------------------

  app.use('/reps', repRoutes); // Sales representatives (read-only)
  app.use('/products', productRoutes); // Product catalog (read-only)
  app.use('/fulfillments', fulfillmentRoutes); // Individual shipments
  app.use('/orders', orderRoutes); // Orders with fulfillments

  // ---------------------------------------------------------------------------
  // Error Handling
  // ---------------------------------------------------------------------------

  // 404 handler - must come after all routes
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Global error handler - must come last and have 4 parameters
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Error:', err);

    // Handle our custom application errors (NotFoundError, ValidationError, etc.)
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        error: err.message,
        code: err.code,
      });
    }

    // Handle Zod validation errors
    if (err.name === 'ZodError') {
      return res.status(400).json({
        error: 'Validation failed',
        details: err,
      });
    }

    // Fallback for unexpected errors
    return res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
