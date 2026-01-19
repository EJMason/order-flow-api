/**
 * Product Service
 *
 * Business logic layer for the product catalog.
 * This is a READ-ONLY service - products cannot be created or modified.
 *
 * Products are referenced when creating fulfillment items. The product's
 * price_cents is captured at the time of order to preserve historical pricing.
 */

import type { ProductRepository } from './productRepository.js';
import type { Product } from '../shared/models.js';
import { NotFoundError } from '../shared/errors.js';

interface Dependencies {
  productRepository: ProductRepository;
}

/**
 * Factory function that creates the product service.
 * Dependencies are injected by Awilix container.
 */
export function createProductService({ productRepository }: Dependencies) {
  /**
   * Get a product by ID. Throws NotFoundError if not found.
   * @param id - The product's unique identifier
   * @throws NotFoundError if product doesn't exist
   */
  async function getProductById(id: string): Promise<Product> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new NotFoundError('Product', id);
    }
    return product;
  }

  /**
   * Get all products in the catalog.
   * @returns Array of all products, sorted by name
   */
  async function getAllProducts(): Promise<Product[]> {
    return productRepository.findAll();
  }

  return { getProductById, getAllProducts };
}

export type ProductService = ReturnType<typeof createProductService>;
