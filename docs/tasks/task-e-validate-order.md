# Task E: Validate Order Before Fulfillment

**Time estimate:** 8-10 minutes

## Objective

Add a helper function to validate that an order can accept new fulfillments.

## Function to Add

In `src/orders/orderService.ts`:

```typescript
async function canAddFulfillment(orderId: string): Promise<{ 
  valid: boolean; 
  reason?: string 
}>
```

## Business Rules

An order **cannot** accept new fulfillments if:
1. Order status is `cancelled`
2. Order status is `fulfilled`
3. Order doesn't exist

## Expected Return Values

```typescript
// Order exists and can accept fulfillments
{ valid: true }

// Order is cancelled
{ valid: false, reason: "Order is cancelled" }

// Order is already fulfilled
{ valid: false, reason: "Order is already fulfilled" }

// Order doesn't exist
{ valid: false, reason: "Order not found" }
```

## Requirements

1. Add the function to `orderService.ts`
2. Export it from the service's return object
3. Use it in `addFulfillmentToOrder` to validate before creating

## Files to Modify

- `src/orders/orderService.ts`

## Hints

- This is a pure validation function - no side effects
- Consider what happens if someone tries to add a fulfillment to a cancelled order
- The existing code doesn't check order status before adding fulfillments - this fixes that gap
