/**
 * Rep Service
 *
 * Business logic layer for sales representatives.
 * This is a READ-ONLY service - reps cannot be created or modified.
 *
 * Reps are referenced by orders to track which salesperson created each order.
 */

import type { RepRepository } from './repRepository.js';
import type { Rep } from '../shared/models.js';
import { NotFoundError } from '../shared/errors.js';

interface Dependencies {
  repRepository: RepRepository;
}

/**
 * Factory function that creates the rep service.
 * Dependencies are injected by Awilix container.
 */
export function createRepService({ repRepository }: Dependencies) {
  /**
   * Get a rep by ID. Throws NotFoundError if not found.
   * @param id - The rep's unique identifier
   * @throws NotFoundError if rep doesn't exist
   */
  async function getRepById(id: string): Promise<Rep> {
    const rep = await repRepository.findById(id);
    if (!rep) {
      throw new NotFoundError('Rep', id);
    }
    return rep;
  }

  /**
   * Get all reps in the system.
   * @returns Array of all reps, sorted by name
   */
  async function getAllReps(): Promise<Rep[]> {
    return repRepository.findAll();
  }

  return { getRepById, getAllReps };
}

export type RepService = ReturnType<typeof createRepService>;
