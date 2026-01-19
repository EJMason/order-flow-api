/**
 * Unit Test Setup
 *
 * This setup file mocks external dependencies (database, etc.) so unit tests
 * can run in isolation without requiring a real database connection.
 *
 * Unit tests focus on testing individual functions/services with mocked dependencies.
 */

import { vi } from 'vitest';

// Mock the database module - prevents real DB connections
vi.mock('../../shared/db.js', () => ({
  sql: {},
  closeDatabase: vi.fn(),
}));

// Mock the container - provides empty service stubs
vi.mock('../../container.js', () => ({
  container: {
    cradle: {},
  },
  cradle: {
    repService: {},
    productService: {},
    fulfillmentService: {},
    orderService: {},
  },
}));
