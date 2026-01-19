/**
 * Rep Service - Unit Tests
 *
 * Tests the repService business logic in isolation using mocked repositories.
 * These tests do NOT hit the database.
 *
 * Pattern: AAA (Arrange-Act-Assert)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRepService } from '../../reps/repService.js';
import { NotFoundError } from '../../shared/errors.js';
import type { Rep } from '../../shared/models.js';

describe('RepService', () => {
  // Mock repository
  const mockRepRepository = {
    findById: vi.fn(),
    findAll: vi.fn(),
  };

  // Create service with mocked dependencies
  const repService = createRepService({ repRepository: mockRepRepository });

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // getRepById
  // ---------------------------------------------------------------------------

  describe('getRepById', () => {
    it('should return a rep when found', async () => {
      // Arrange
      const mockRep: Rep = {
        id: 'rep_001',
        first_name: 'Sarah',
        last_name: 'Johnson',
        email: 'sarah@example.com',
        phone: '+15551234567',
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockRepRepository.findById.mockResolvedValue(mockRep);

      // Act
      const result = await repService.getRepById('rep_001');

      // Assert
      expect(result).toEqual(mockRep);
      expect(mockRepRepository.findById).toHaveBeenCalledWith('rep_001');
      expect(mockRepRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when rep does not exist', async () => {
      // Arrange
      mockRepRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(repService.getRepById('nonexistent')).rejects.toThrow(NotFoundError);
      await expect(repService.getRepById('nonexistent')).rejects.toThrow(
        "Rep with id 'nonexistent' not found"
      );
    });
  });

  // ---------------------------------------------------------------------------
  // getAllReps
  // ---------------------------------------------------------------------------

  describe('getAllReps', () => {
    it('should return all reps', async () => {
      // Arrange
      const mockReps: Rep[] = [
        {
          id: 'rep_001',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah@example.com',
          phone: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'rep_002',
          first_name: 'Mike',
          last_name: 'Chen',
          email: 'mike@example.com',
          phone: '+15559876543',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      mockRepRepository.findAll.mockResolvedValue(mockReps);

      // Act
      const result = await repService.getAllReps();

      // Assert
      expect(result).toEqual(mockReps);
      expect(result).toHaveLength(2);
      expect(mockRepRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no reps exist', async () => {
      // Arrange
      mockRepRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await repService.getAllReps();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
