# Task D: Order Summary Endpoint

**Time estimate:** 10-12 minutes

## Objective

Add an endpoint that returns a summary of an order with calculated stats.

## Endpoint

```
GET /orders/:id/summary
```

## Expected Response

```json
{
  "order_id": "ord_001",
  "rep_name": "Sarah Johnson",
  "status": "paid",
  "total_cents": 9000,
  "fulfillment_count": 2,
  "item_count": 3,
  "status_breakdown": {
    "pending": 1,
    "shipped": 1,
    "delivered": 0,
    "cancelled": 0
  }
}
```

## Requirements

1. Return `404` if order not found
2. Include rep's full name (first + last)
3. Count total fulfillments and total items across all fulfillments
4. Break down fulfillment counts by status

## Files to Modify

- `src/orders/orderService.ts` - Add `getOrderSummary` function
- `src/orders/orderRoutes.ts` - Add endpoint
- `src/shared/models.ts` - (Optional) Add `OrderSummary` type

## Hints

- You'll need to join data from orders, reps, and fulfillments
- Consider whether to do aggregation in SQL or in JavaScript
- Look at existing `getOrderWithFulfillments` for reference
