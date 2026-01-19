/**
 * Integration Test Setup
 *
 * Integration tests hit the real database and test the full request/response cycle.
 * Make sure DATABASE_URL is set in your environment before running these tests.
 *
 * These tests use supertest to make HTTP requests to the Express app.
 */

import 'dotenv/config';

// Verify database connection is available
if (!process.env.DATABASE_URL) {
  console.warn('⚠️  DATABASE_URL not set - integration tests may fail');
}
