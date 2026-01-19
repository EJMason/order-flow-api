/**
 * Product Repository
 *
 * Data access layer for the product catalog.
 * This is a READ-ONLY table - products are pre-seeded and not modified by the API.
 *
 * Products represent gift items that can be included in fulfillments.
 *
 * Database table: products
 * - id: TEXT PRIMARY KEY (e.g., 'prod_001')
 * - name: TEXT (e.g., 'Welcome Gift Box')
 * - sku: TEXT UNIQUE (e.g., 'GIFT-WELCOME-001')
 * - price_cents: INTEGER (price in cents, e.g., 4500 = $45.00)
 * - created_at: TIMESTAMPTZ
 * - updated_at: TIMESTAMPTZ
 */

import { sql } from '../shared/db.js';
import type { Product } from '../shared/models.js';

/**
 * Factory function that creates the product repository.
 * Uses the factory pattern for dependency injection with Awilix.
 */
export function createProductRepository() {
  /**
   * Find a product by its ID.
   * @param id - The product's unique identifier (e.g., 'prod_001')
   * @returns The product if found, null otherwise
   */
  async function findById(id: string): Promise<Product | null> {
    const [product] = await sql<Product[]>`
      SELECT * FROM products WHERE id = ${id}
    `;
    return product ?? null;
  }

  /**
   * Get all products in the catalog, sorted alphabetically by name.
   * @returns Array of all products
   */
  async function findAll(): Promise<Product[]> {
    return sql<Product[]>`SELECT * FROM products ORDER BY name`;
  }

  return { findById, findAll };
}

export type ProductRepository = ReturnType<typeof createProductRepository>;
