/**
 * Rep Routes
 *
 * REST API endpoints for sales representatives.
 * READ-ONLY - no POST/PUT/DELETE endpoints.
 *
 * Endpoints:
 * - GET /reps       - List all reps
 * - GET /reps/:id   - Get a specific rep by ID
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { cradle } from '../container.js';

const router = Router();

/**
 * GET /reps
 * Returns all sales representatives.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const reps = await cradle.repService.getAllReps();
    res.json(reps);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /reps/:id
 * Returns a single rep by ID.
 * Returns 404 if not found.
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rep = await cradle.repService.getRepById(req.params.id as string);
    res.json(rep);
  } catch (error) {
    next(error);
  }
});

export { router as repRoutes };
