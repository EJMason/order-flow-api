# Order Fulfillment API

Technical interview exercise.

## Setup

1. Install dependencies:

```bash
   npm install
```

2. Configure environment:

```bash
   cp .env.example .env
   # Edit .env with your Neon database URL
```

3. Start dev server:

```bash
   npm run dev
```

4. Verify:

```bash
   curl http://localhost:3000/health
```

## Scripts

| Script              | Description            |
| ------------------- | ---------------------- |
| `npm run dev`       | Start with hot reload  |
| `npm run test`      | Run tests (watch mode) |
| `npm run test:run`  | Run tests once         |
| `npm run typecheck` | Check types            |
| `npm run format`    | Format code            |
