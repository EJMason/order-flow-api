# Task A: Cancel Fulfillment

**Time estimate:** 10-15 minutes

## Objective

Add an endpoint to cancel a fulfillment.

## Endpoint

```
POST /fulfillments/:id/cancel
```

## Requirements

1. Only fulfillments with status `pending` or `processing` can be cancelled
2. Return `409 Conflict` if the fulfillment is already `shipped`, `delivered`, or `cancelled`
3. Update the fulfillment status to `cancelled`
4. Recalculate the parent order's `total_cents` (subtract the cancelled items' value)

## Expected Response

**Success (200):**
```json
{
  "id": "ful_123",
  "order_id": "ord_456",
  "status": "cancelled",
  "items": [...],
  ...
}
```

**Error - Cannot Cancel (409):**
```json
{
  "error": "Cannot cancel fulfillment with status 'shipped'",
  "code": "VALIDATION_ERROR"
}
```

## Files to Modify

- `src/fulfillments/fulfillmentService.ts` - Add cancel logic
- `src/fulfillments/fulfillmentRoutes.ts` - Add endpoint
- `src/orders/orderService.ts` or `orderRepository.ts` - Update order total

## Hints

- Look at how `updateFulfillmentStatus` validates transitions
- The order total should be recalculated from remaining non-cancelled fulfillment items
- Consider creating a helper function `canCancel(status)` for readability
