import { z } from 'zod';

export const fulfillmentStatusEnum = z.enum([
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]);

export const createFulfillmentSchema = z.object({
  recipient_name: z.string().min(1, 'Recipient name is required'),
  recipient_email: z.email('Invalid email format').nullable().optional(),
  ship_to_address: z.string().min(1, 'Address is required'),
  ship_to_city: z.string().min(1, 'City is required'),
  ship_to_state: z.string().length(2, 'State must be 2 characters'),
  ship_to_zip: z.string().min(5, 'ZIP code is required'),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1, 'Product ID is required'),
        quantity: z.number().int().positive('Quantity must be positive'),
      })
    )
    .min(1, 'At least one item is required'),
});

export const updateFulfillmentStatusSchema = z.object({
  status: fulfillmentStatusEnum,
});

export type CreateFulfillmentInput = z.infer<typeof createFulfillmentSchema>;
export type UpdateFulfillmentStatusInput = z.infer<typeof updateFulfillmentStatusSchema>;
