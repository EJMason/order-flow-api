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

- Use the AAA pattern (Arrange-Act-Assert)
- Mock the repositories (don't hit the database)
- Use Vitest

## Notes

- Review existing unit tests for patterns
- Consider what dependencies need to be mocked
