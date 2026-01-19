import { vi } from 'vitest';

// Mock the database module before any imports
vi.mock('../shared/db.js', () => ({
  sql: {},
  closeDatabase: vi.fn(),
}));
