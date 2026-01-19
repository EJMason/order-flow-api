/**
 * Product Routes
 *
 * REST API endpoints for the product catalog.
 * READ-ONLY - no POST/PUT/DELETE endpoints.
 *
 * Endpoints:
 * - GET /products       - List all products
 * - GET /products/:id   - Get a specific product by ID
 */

import { Router, type Request, type Response, type NextFunction } from 'express';
import { cradle } from '../container.js';

const router = Router();

/**
 * GET /products
 * Returns all products in the catalog.
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await cradle.productService.getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /products/:id
 * Returns a single product by ID.
 * Returns 404 if not found.
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await cradle.productService.getProductById(req.params.id as string);
    res.json(product);
  } catch (error) {
    next(error);
  }
});

export { router as productRoutes };
