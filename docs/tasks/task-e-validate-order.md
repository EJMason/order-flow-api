# Task E: Validate Order Before Fulfillment

**Time estimate:** 8-10 minutes

## Objective

Add validation to prevent adding fulfillments to orders that shouldn't accept them.

## Business Rules

An order **cannot** accept new fulfillments if:
1. Order status is `cancelled`
2. Order status is `fulfilled`

Currently `addFulfillmentToOrder` doesn't check this.

## Requirements

1. Update `addFulfillmentToOrder` to validate order status before creating fulfillment
2. Return `400 Bad Request` with appropriate message if validation fails
3. Only `pending` and `paid` orders can accept new fulfillments

## Expected Error Response

```json
{
  "error": "Cannot add fulfillment to order with status 'cancelled'",
  "code": "VALIDATION_ERROR"
}
```
