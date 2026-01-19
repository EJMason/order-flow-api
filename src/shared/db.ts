import postgres from 'postgres';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

export const sql = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export type Transaction = postgres.TransactionSql<Record<string, unknown>>;

export async function closeDatabase(): Promise<void> {
  await sql.end();
}
