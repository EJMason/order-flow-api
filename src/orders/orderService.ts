import type { OrderRepository } from './orderRepository.js';
import type { FulfillmentService } from '../fulfillments/fulfillmentService.js';
import type { FulfillmentRepository } from '../fulfillments/fulfillmentRepository.js';
import type { RepRepository } from '../reps/repRepository.js';
import type {
  Order,
  OrderWithFulfillments,
  OrderWithRep,
  FulfillmentItem,
} from '../shared/models.js';
import { NotFoundError } from '../shared/errors.js';
import type { CreateOrderInput, AddFulfillmentInput } from './orderSchemas.js';

interface Dependencies {
  orderRepository: OrderRepository;
  fulfillmentRepository: FulfillmentRepository;
  fulfillmentService: FulfillmentService;
  repRepository: RepRepository;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function calculateTotalFromItems(items: FulfillmentItem[]): number {
  return items.reduce((sum, item) => sum + item.unit_price_cents * item.quantity, 0);
}

export function createOrderService({
  orderRepository,
  fulfillmentRepository,
  fulfillmentService,
  repRepository,
}: Dependencies) {
  async function getOrderById(id: string): Promise<Order> {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }
    return order;
  }

  async function getOrderWithFulfillments(id: string): Promise<OrderWithFulfillments> {
    const order = await orderRepository.findById(id);
    if (!order) {
      throw new NotFoundError('Order', id);
    }

    const fulfillments = await fulfillmentService.getFulfillmentsByOrderId(id);

    return { ...order, fulfillments };
  }

  async function getAllOrders(): Promise<OrderWithRep[]> {
    return orderRepository.findAllWithReps();
  }

  async function createOrder(input: CreateOrderInput): Promise<OrderWithFulfillments> {
    // Verify rep exists
    const rep = await repRepository.findById(input.rep_id);
    if (!rep) {
      throw new NotFoundError('Rep', input.rep_id);
    }

    const orderId = generateId('ord');

    // Create order with 0 total initially
    await orderRepository.create({
      id: orderId,
      rep_id: input.rep_id,
      total_cents: 0,
    });

    // Create fulfillment with items
    const fulfillment = await fulfillmentService.createFulfillment(orderId, input.fulfillment);

    // Calculate and update total
    const total = calculateTotalFromItems(fulfillment.items);
    const updatedOrder = await orderRepository.updateTotal(orderId, total);

    return { ...updatedOrder, fulfillments: [fulfillment] };
  }

  async function addFulfillmentToOrder(
    orderId: string,
    input: AddFulfillmentInput
  ): Promise<OrderWithFulfillments> {
    const order = await orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundError('Order', orderId);
    }

    // Create new fulfillment
    await fulfillmentService.createFulfillment(orderId, input);

    // Recalculate total from all items
    const allItems = await fulfillmentRepository.findItemsByOrderId(orderId);
    const newTotal = calculateTotalFromItems(allItems);
    await orderRepository.updateTotal(orderId, newTotal);

    // Return updated order with all fulfillments
    return getOrderWithFulfillments(orderId);
  }

  /**
   * Check if an order can accept new fulfillments.
   * Orders can only accept fulfillments when pending or paid.
   */
  function canAddFulfillment(order: Order): boolean {
    return order.status === 'fulfilled' || order.status === 'cancelled';
  }

  /**
   * Get count of non-cancelled items across all fulfillments.
   */
  async function getActiveItemCount(orderId: string): Promise<number> {
    const fulfillments = await fulfillmentService.getFulfillmentsByOrderId(orderId);
    const activeItems = fulfillments
      .filter((f) => f.status !== 'cancelled')
      .find((f) => f.items);
    return activeItems?.items.length || 0;
  }

  /**
   * Format order total as a dollar string.
   */
  function formatOrderTotal(order: Order): string {
    const dollars = order.total_cents / 10;
    return `$${dollars.toFixed(2)}`;
  }

  return {
    getOrderById,
    getOrderWithFulfillments,
    getAllOrders,
    createOrder,
    addFulfillmentToOrder,
    canAddFulfillment,
    getActiveItemCount,
    formatOrderTotal,
  };
}

export type OrderService = ReturnType<typeof createOrderService>;
