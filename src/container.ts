/**
 * Dependency Injection Container
 *
 * Uses Awilix for dependency injection with the factory function pattern.
 * All services and repositories are registered here and resolved via the cradle.
 *
 * Usage in routes:
 *   import { cradle } from '../container.js';
 *   const orders = await cradle.orderService.getAllOrders();
 *
 * The factory pattern allows services to declare their dependencies, and Awilix
 * automatically injects them based on the registered names.
 */

import { createContainer, asFunction, asValue, InjectionMode } from 'awilix';
import { sql } from './shared/db.js';

// Repositories (data access layer)
import { createRepRepository, type RepRepository } from './reps/repRepository.js';
import { createProductRepository, type ProductRepository } from './products/productRepository.js';
import {
  createFulfillmentRepository,
  type FulfillmentRepository,
} from './fulfillments/fulfillmentRepository.js';
import { createOrderRepository, type OrderRepository } from './orders/orderRepository.js';

// Services (business logic layer)
import { createRepService, type RepService } from './reps/repService.js';
import { createProductService, type ProductService } from './products/productService.js';
import {
  createFulfillmentService,
  type FulfillmentService,
} from './fulfillments/fulfillmentService.js';
import { createOrderService, type OrderService } from './orders/orderService.js';

/**
 * Type-safe container interface.
 * Lists all available dependencies that can be resolved from the cradle.
 */
export interface Cradle {
  sql: typeof sql;
  // Repositories
  repRepository: RepRepository;
  productRepository: ProductRepository;
  fulfillmentRepository: FulfillmentRepository;
  orderRepository: OrderRepository;
  // Services
  repService: RepService;
  productService: ProductService;
  fulfillmentService: FulfillmentService;
  orderService: OrderService;
}

/**
 * Creates and configures the Awilix container.
 * PROXY mode allows services to reference each other without worrying about registration order.
 */
export function configureContainer() {
  const container = createContainer<Cradle>({
    injectionMode: InjectionMode.PROXY,
  });

  container.register({
    // Database connection
    sql: asValue(sql),

    // Repositories - data access layer
    repRepository: asFunction(createRepRepository).singleton(),
    productRepository: asFunction(createProductRepository).singleton(),
    fulfillmentRepository: asFunction(createFulfillmentRepository).singleton(),
    orderRepository: asFunction(createOrderRepository).singleton(),

    // Services - business logic layer
    repService: asFunction(createRepService).singleton(),
    productService: asFunction(createProductService).singleton(),
    fulfillmentService: asFunction(createFulfillmentService).singleton(),
    orderService: asFunction(createOrderService).singleton(),
  });

  return container;
}

export const container = configureContainer();

/**
 * The cradle provides direct access to all registered dependencies.
 * This is the primary way to access services in routes.
 */
export const cradle = container.cradle;
