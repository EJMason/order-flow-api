/**
 * Rep Repository
 *
 * Data access layer for sales representatives.
 * This is a READ-ONLY table - reps are pre-seeded and not modified by the API.
 *
 * Database table: reps
 * - id: TEXT PRIMARY KEY (e.g., 'rep_001')
 * - first_name: TEXT
 * - last_name: TEXT
 * - email: TEXT UNIQUE
 * - phone: TEXT (nullable)
 * - created_at: TIMESTAMPTZ
 * - updated_at: TIMESTAMPTZ
 */

import { sql } from '../shared/db.js';
import type { Rep } from '../shared/models.js';

/**
 * Factory function that creates the rep repository.
 * Uses the factory pattern for dependency injection with Awilix.
 */
export function createRepRepository() {
  /**
   * Find a rep by their ID.
   * @param id - The rep's unique identifier (e.g., 'rep_001')
   * @returns The rep if found, null otherwise
   */
  async function findById(id: string): Promise<Rep | null> {
    const [rep] = await sql<Rep[]>`
      SELECT * FROM reps WHERE id = ${id}
    `;
    return rep ?? null;
  }

  /**
   * Get all reps, sorted alphabetically by name.
   * @returns Array of all reps
   */
  async function findAll(): Promise<Rep[]> {
    return sql<Rep[]>`SELECT * FROM reps ORDER BY last_name, first_name`;
  }

  return { findById, findAll };
}

export type RepRepository = ReturnType<typeof createRepRepository>;
