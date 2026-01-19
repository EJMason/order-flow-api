/**
 * Database Connection
 *
 * PostgreSQL connection using the 'postgres' package (porsager/postgres).
 * Connection string is read from DATABASE_URL environment variable.
 *
 * Usage:
 *   import { sql } from './shared/db.js';
 *   const users = await sql`SELECT * FROM users WHERE id = ${id}`;
 *
 * The sql tagged template automatically handles parameterization to prevent SQL injection.
 */

import postgres from 'postgres';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

/**
 * PostgreSQL client instance.
 * Use as a tagged template: sql`SELECT * FROM table WHERE id = ${id}`
 */
export const sql = postgres(connectionString, {
  max: 10, // Maximum connections in pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Timeout for new connections
});

/**
 * Type for database transactions.
 * Used when you need to run multiple queries atomically.
 */
export type Transaction = postgres.TransactionSql<Record<string, unknown>>;

/**
 * Gracefully close all database connections.
 * Called during server shutdown.
 */
export async function closeDatabase(): Promise<void> {
  await sql.end();
}
