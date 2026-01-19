import { Router, type Request, type Response, type NextFunction } from 'express';
import { cradle } from '../container.js';
import { updateFulfillmentStatusSchema } from './fulfillmentSchemas.js';

const router = Router();

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const fulfillment = await cradle.fulfillmentService.getFulfillmentById(req.params.id as string);
    res.json(fulfillment);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id/status', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = updateFulfillmentStatusSchema.parse(req.body);
    const fulfillment = await cradle.fulfillmentService.updateFulfillmentStatus(
      req.params.id as string,
      input
    );
    res.json(fulfillment);
  } catch (error) {
    next(error);
  }
});

export { router as fulfillmentRoutes };
