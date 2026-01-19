/**
 * Domain Models
 *
 * TypeScript interfaces representing database entities.
 * These types are used throughout the application for type safety.
 *
 * Entity Relationships:
 *   Rep (1) ──< Order (1) ──< Fulfillment (1) ──< FulfillmentItem (n) >── Product
 *
 * - A Rep can have many Orders
 * - An Order can have many Fulfillments (multiple shipments)
 * - A Fulfillment can have many FulfillmentItems
 * - A FulfillmentItem references one Product
 */

// =============================================================================
// Base Entities
// =============================================================================

/**
 * Sales Representative - READ ONLY
 * Pre-seeded data representing salespeople who create orders.
 */
export interface Rep {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Product - READ ONLY
 * Gift items that can be included in fulfillments.
 * Prices are stored in cents (e.g., 4500 = $45.00).
 */
export interface Product {
  id: string;
  name: string;
  sku: string;
  price_cents: number;
  created_at: Date;
  updated_at: Date;
}

// =============================================================================
// Order Entities
// =============================================================================

export type OrderStatus = 'pending' | 'paid' | 'fulfilled' | 'cancelled';

/**
 * Order - a payment/transaction record.
 * Contains one or more Fulfillments (shipments).
 * total_cents is the sum of all fulfillment items.
 */
export interface Order {
  id: string;
  rep_id: string;
  status: OrderStatus;
  total_cents: number;
  created_at: Date;
  updated_at: Date;
}

// =============================================================================
// Fulfillment Entities
// =============================================================================

export type FulfillmentStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

/**
 * Fulfillment - an individual shipment within an order.
 * An order can have multiple fulfillments (e.g., shipping to different addresses).
 */
export interface Fulfillment {
  id: string;
  order_id: string;
  recipient_name: string;
  recipient_email: string | null;
  ship_to_address: string;
  ship_to_city: string;
  ship_to_state: string;
  ship_to_zip: string;
  status: FulfillmentStatus;
  tracking_number: string | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * FulfillmentItem - a product line item in a fulfillment.
 * Captures the price at time of order (unit_price_cents).
 */
export interface FulfillmentItem {
  id: string;
  fulfillment_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
  created_at: Date;
}

// =============================================================================
// Enriched Types (for API responses)
// =============================================================================

/**
 * Order with rep's full name included.
 * Used in order list responses.
 */
export interface OrderWithRep extends Order {
  rep_name: string;
}

/**
 * Order with all fulfillments and their items.
 * Used in order detail responses.
 */
export interface OrderWithFulfillments extends Order {
  fulfillments: FulfillmentWithItems[];
}

/**
 * Fulfillment with its line items included.
 */
export interface FulfillmentWithItems extends Fulfillment {
  items: FulfillmentItem[];
}
