import { sql } from '../shared/db.js';
import type { Fulfillment, FulfillmentItem, FulfillmentStatus } from '../shared/models.js';

export interface CreateFulfillmentData {
  id: string;
  order_id: string;
  recipient_name: string;
  recipient_email: string | null;
  ship_to_address: string;
  ship_to_city: string;
  ship_to_state: string;
  ship_to_zip: string;
}

export interface CreateFulfillmentItemData {
  id: string;
  fulfillment_id: string;
  product_id: string;
  quantity: number;
  unit_price_cents: number;
}

export function createFulfillmentRepository() {
  async function findById(id: string): Promise<Fulfillment | null> {
    const [fulfillment] = await sql<Fulfillment[]>`
      SELECT * FROM fulfillments WHERE id = ${id}
    `;
    return fulfillment ?? null;
  }

  async function findByOrderId(orderId: string): Promise<Fulfillment[]> {
    return sql<Fulfillment[]>`
      SELECT * FROM fulfillments WHERE order_id = ${orderId} ORDER BY created_at
    `;
  }

  async function create(data: CreateFulfillmentData): Promise<Fulfillment> {
    const [fulfillment] = await sql<Fulfillment[]>`
      INSERT INTO fulfillments (id, order_id, recipient_name, recipient_email, ship_to_address, ship_to_city, ship_to_state, ship_to_zip)
      VALUES (${data.id}, ${data.order_id}, ${data.recipient_name}, ${data.recipient_email}, ${data.ship_to_address}, ${data.ship_to_city}, ${data.ship_to_state}, ${data.ship_to_zip})
      RETURNING *
    `;
    return fulfillment!;
  }

  async function updateStatus(id: string, status: FulfillmentStatus): Promise<Fulfillment> {
    const [fulfillment] = await sql<Fulfillment[]>`
      UPDATE fulfillments 
      SET status = ${status}, updated_at = NOW() 
      WHERE id = ${id}
      RETURNING *
    `;
    return fulfillment!;
  }

  async function createItem(data: CreateFulfillmentItemData): Promise<FulfillmentItem> {
    const [item] = await sql<FulfillmentItem[]>`
      INSERT INTO fulfillment_items (id, fulfillment_id, product_id, quantity, unit_price_cents)
      VALUES (${data.id}, ${data.fulfillment_id}, ${data.product_id}, ${data.quantity}, ${data.unit_price_cents})
      RETURNING *
    `;
    return item!;
  }

  async function findItemsByFulfillmentId(fulfillmentId: string): Promise<FulfillmentItem[]> {
    return sql<FulfillmentItem[]>`
      SELECT * FROM fulfillment_items WHERE fulfillment_id = ${fulfillmentId} ORDER BY created_at
    `;
  }

  async function findItemsByOrderId(orderId: string): Promise<FulfillmentItem[]> {
    return sql<FulfillmentItem[]>`
      SELECT fi.* 
      FROM fulfillment_items fi
      JOIN fulfillments f ON f.id = fi.fulfillment_id
      WHERE f.order_id = ${orderId}
    `;
  }

  return {
    findById,
    findByOrderId,
    create,
    updateStatus,
    createItem,
    findItemsByFulfillmentId,
    findItemsByOrderId,
  };
}

export type FulfillmentRepository = ReturnType<typeof createFulfillmentRepository>;
