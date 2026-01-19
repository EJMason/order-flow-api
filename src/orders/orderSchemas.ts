import { z } from 'zod';

export const orderStatusEnum = z.enum(['pending', 'paid', 'fulfilled', 'cancelled']);

export const createOrderSchema = z.object({
  rep_id: z.string().min(1, 'Rep ID is required'),
  fulfillment: z.object({
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
  }),
});

export const addFulfillmentSchema = z.object({
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

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type AddFulfillmentInput = z.infer<typeof addFulfillmentSchema>;
