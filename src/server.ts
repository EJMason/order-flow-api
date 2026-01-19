import 'dotenv/config';
import { createApp } from './app.js';
import { closeDatabase } from './shared/db.js';

const PORT = process.env.PORT || 3000;

const app = createApp();

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

async function shutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Shutting down...`);

  server.close(async () => {
    console.log('HTTP server closed');
    await closeDatabase();
    console.log('Database closed');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forced shutdown');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
