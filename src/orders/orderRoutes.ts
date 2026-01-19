import { Router, type Request, type Response, type NextFunction } from 'express';
import { cradle } from '../container.js';
import { createOrderSchema, addFulfillmentSchema } from './orderSchemas.js';

const router = Router();

router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await cradle.orderService.getAllOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await cradle.orderService.getOrderWithFulfillments(req.params.id as string);
    res.json(order);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = createOrderSchema.parse(req.body);
    const order = await cradle.orderService.createOrder(input);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/fulfillments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = addFulfillmentSchema.parse(req.body);
    const order = await cradle.orderService.addFulfillmentToOrder(req.params.id as string, input);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

export { router as orderRoutes };
