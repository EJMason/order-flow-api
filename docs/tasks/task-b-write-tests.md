# Task B: Write Unit Tests for Order Service

**Time estimate:** 10-15 minutes

## Objective

Write unit tests for the `createOrder` function in the order service.

## File to Create

```
src/test/unit/orderService.test.ts
```

## Test Cases

Write tests for `createOrder`:

1. **Success case** - Creates order and returns correct total
2. **Rep not found** - Throws `NotFoundError` when `rep_id` doesn't exist
3. **Total calculation** - Verifies total is `quantity × unit_price_cents`

## Requirements

- Use the **AAA pattern** (Arrange-Act-Assert)
- Mock the repositories (don't hit the database)
- Use Vitest (`describe`, `it`, `expect`, `vi.fn()`)

## Example Structure

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrderService } from '../../orders/orderService.js';
// ... imports

describe('OrderService', () => {
  // Setup mocks
  const mockOrderRepository = { ... };
  const mockFulfillmentService = { ... };
  // etc.

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create order with correct total', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should throw NotFoundError when rep does not exist', async () => {
      // ...
    });

    it('should calculate total as quantity × price', async () => {
      // ...
    });
  });
});
```

## Hints

- Look at `src/test/unit/repService.test.ts` for an example
- Mock `fulfillmentService.createFulfillment` to return a fulfillment with items
- The total should be sum of (quantity × unit_price_cents) for all items
