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
4. Recalculate the parent order's `total_cents` (subtract cancelled items' value)

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
  "code": "CONFLICT"
}
```

## Notes

- Review existing code patterns for status transitions
- Consider what error types already exist in the codebase
