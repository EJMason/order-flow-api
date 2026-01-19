/**
 * Product Service - Unit Tests
 *
 * Tests the productService business logic in isolation using mocked repositories.
 * These tests do NOT hit the database.
 *
 * Pattern: AAA (Arrange-Act-Assert)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProductService } from '../../products/productService.js';
import { NotFoundError } from '../../shared/errors.js';
import type { Product } from '../../shared/models.js';

describe('ProductService', () => {
  // Mock repository
  const mockProductRepository = {
    findById: vi.fn(),
    findAll: vi.fn(),
  };

  // Create service with mocked dependencies
  const productService = createProductService({ productRepository: mockProductRepository });

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ---------------------------------------------------------------------------
  // getProductById
  // ---------------------------------------------------------------------------

  describe('getProductById', () => {
    it('should return a product when found', async () => {
      // Arrange
      const mockProduct: Product = {
        id: 'prod_001',
        name: 'Welcome Gift Box',
        sku: 'GIFT-WELCOME-001',
        price_cents: 4500,
        created_at: new Date(),
        updated_at: new Date(),
      };
      mockProductRepository.findById.mockResolvedValue(mockProduct);

      // Act
      const result = await productService.getProductById('prod_001');

      // Assert
      expect(result).toEqual(mockProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith('prod_001');
      expect(mockProductRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundError when product does not exist', async () => {
      // Arrange
      mockProductRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(productService.getProductById('nonexistent')).rejects.toThrow(NotFoundError);
      await expect(productService.getProductById('nonexistent')).rejects.toThrow(
        "Product with id 'nonexistent' not found"
      );
    });
  });

  // ---------------------------------------------------------------------------
  // getAllProducts
  // ---------------------------------------------------------------------------

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      // Arrange
      const mockProducts: Product[] = [
        {
          id: 'prod_001',
          name: 'Welcome Gift Box',
          sku: 'GIFT-WELCOME-001',
          price_cents: 4500,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 'prod_002',
          name: 'Premium Thank You Package',
          sku: 'GIFT-THANKYOU-001',
          price_cents: 7500,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ];
      mockProductRepository.findAll.mockResolvedValue(mockProducts);

      // Act
      const result = await productService.getAllProducts();

      // Assert
      expect(result).toEqual(mockProducts);
      expect(result).toHaveLength(2);
      expect(mockProductRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no products exist', async () => {
      // Arrange
      mockProductRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await productService.getAllProducts();

      // Assert
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });
  });
});
