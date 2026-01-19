import { sql } from '../shared/db.js';
import type { Order, OrderStatus } from '../shared/models.js';

export interface CreateOrderData {
  id: string;
  rep_id: string;
  total_cents: number;
}

export function createOrderRepository() {
  async function findById(id: string): Promise<Order | null> {
    const [order] = await sql<Order[]>`
      SELECT * FROM orders WHERE id = ${id}
    `;
    return order ?? null;
  }

  async function findAll(): Promise<Order[]> {
    return sql<Order[]>`SELECT * FROM orders ORDER BY created_at DESC`;
  }

  async function findAllWithReps(): Promise<(Order & { rep_name: string })[]> {
    return sql<(Order & { rep_name: string })[]>`
      SELECT o.*, CONCAT(r.first_name, ' ', r.last_name) as rep_name
      FROM orders o
      JOIN reps r ON r.id = o.rep_id
      ORDER BY o.created_at DESC
    `;
  }

  async function create(data: CreateOrderData): Promise<Order> {
    const [order] = await sql<Order[]>`
      INSERT INTO orders (id, rep_id, total_cents)
      VALUES (${data.id}, ${data.rep_id}, ${data.total_cents})
      RETURNING *
    `;
    return order!;
  }

  async function updateTotal(id: string, totalCents: number): Promise<Order> {
    const [order] = await sql<Order[]>`
      UPDATE orders 
      SET total_cents = ${totalCents}, updated_at = NOW() 
      WHERE id = ${id}
      RETURNING *
    `;
    return order!;
  }

  async function updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const [order] = await sql<Order[]>`
      UPDATE orders 
      SET status = ${status}, updated_at = NOW() 
      WHERE id = ${id}
      RETURNING *
    `;
    return order!;
  }

  return { findById, findAll, findAllWithReps, create, updateTotal, updateStatus };
}

export type OrderRepository = ReturnType<typeof createOrderRepository>;
