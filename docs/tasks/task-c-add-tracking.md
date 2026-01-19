# Task C: Add Tracking Number

**Time estimate:** 8-12 minutes

## Objective

Add an endpoint to update a fulfillment's tracking number.

## Endpoint

```
PATCH /fulfillments/:id/tracking
```

## Request Body

```json
{
  "tracking_number": "1Z999AA10123456784"
}
```

## Requirements

1. Only fulfillments with status `processing` or `shipped` can have tracking added
2. Return `400 Bad Request` if status is `pending`, `delivered`, or `cancelled`
3. Tracking number must be a non-empty string
4. Return the updated fulfillment with items

## Expected Response

**Success (200):**
```json
{
  "id": "ful_123",
  "tracking_number": "1Z999AA10123456784",
  "status": "processing",
  ...
}
```

**Error (400):**
```json
{
  "error": "Cannot add tracking to fulfillment with status 'pending'",
  "code": "VALIDATION_ERROR"
}
```

## Files to Modify

- `src/fulfillments/fulfillmentSchemas.ts` - Add Zod schema
- `src/fulfillments/fulfillmentRepository.ts` - Add `updateTrackingNumber` function
- `src/fulfillments/fulfillmentService.ts` - Add business logic
- `src/fulfillments/fulfillmentRoutes.ts` - Add endpoint

## Hints

- Use Zod v4 syntax: `z.string().min(1, 'Tracking number is required')`
- Pattern similar to `updateFulfillmentStatus`
