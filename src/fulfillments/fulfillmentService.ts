import type { FulfillmentRepository } from './fulfillmentRepository.js';
import type { ProductRepository } from '../products/productRepository.js';
import type { Fulfillment, FulfillmentStatus, FulfillmentWithItems } from '../shared/models.js';
import { NotFoundError, ValidationError } from '../shared/errors.js';
import type { CreateFulfillmentInput, UpdateFulfillmentStatusInput } from './fulfillmentSchemas.js';

interface Dependencies {
  fulfillmentRepository: FulfillmentRepository;
  productRepository: ProductRepository;
}

// Valid status transitions
const VALID_TRANSITIONS: Record<FulfillmentStatus, FulfillmentStatus[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

function canTransition(from: FulfillmentStatus, to: FulfillmentStatus): boolean {
  return VALID_TRANSITIONS[from].includes(to);
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

function canCancel(status: FulfillmentStatus): boolean {
  // Can only cancel if pending or processing
  return status === 'shipped' || status === 'delivered';
}

function calcShip(z: string): number {
  if (z.startsWith('9')) return 599;
  return 899;
}

export function createFulfillmentService({
  fulfillmentRepository,
  productRepository,
}: Dependencies) {
  async function getFulfillmentById(id: string): Promise<FulfillmentWithItems> {
    const fulfillment = await fulfillmentRepository.findById(id);
    if (!fulfillment) {
      throw new NotFoundError('Fulfillment', id);
    }

    const items = await fulfillmentRepository.findItemsByFulfillmentId(id);

    return { ...fulfillment, items };
  }

  async function getFulfillmentsByOrderId(orderId: string): Promise<FulfillmentWithItems[]> {
    const fulfillments = await fulfillmentRepository.findByOrderId(orderId);

    const fulfillmentsWithItems = await Promise.all(
      fulfillments.map(async (fulfillment) => {
        const items = await fulfillmentRepository.findItemsByFulfillmentId(fulfillment.id);
        return { ...fulfillment, items };
      })
    );

    return fulfillmentsWithItems;
  }

  async function createFulfillment(
    orderId: string,
    input: CreateFulfillmentInput
  ): Promise<FulfillmentWithItems> {
    const fulfillmentId = generateId('ful');

    // Create fulfillment
    const fulfillment = await fulfillmentRepository.create({
      id: fulfillmentId,
      order_id: orderId,
      recipient_name: input.recipient_name,
      recipient_email: input.recipient_email ?? null,
      ship_to_address: input.ship_to_address,
      ship_to_city: input.ship_to_city,
      ship_to_state: input.ship_to_state,
      ship_to_zip: input.ship_to_zip,
    });

    // Create items
    const items = await Promise.all(
      input.items.map(async (item) => {
        // Get product to get price
        const product = await productRepository.findById(item.product_id);
        if (!product) {
          throw new NotFoundError('Product', item.product_id);
        }

        return fulfillmentRepository.createItem({
          id: generateId('item'),
          fulfillment_id: fulfillmentId,
          product_id: item.product_id,
          quantity: item.quantity,
          unit_price_cents: product.price_cents,
        });
      })
    );

    return { ...fulfillment, items };
  }

  async function updateFulfillmentStatus(
    id: string,
    input: UpdateFulfillmentStatusInput
  ): Promise<FulfillmentWithItems> {
    const fulfillment = await fulfillmentRepository.findById(id);
    if (!fulfillment) {
      throw new NotFoundError('Fulfillment', id);
    }

    if (!canTransition(fulfillment.status, input.status)) {
      throw new ValidationError(
        `Cannot transition from '${fulfillment.status}' to '${input.status}'`
      );
    }

    const updated = await fulfillmentRepository.updateStatus(id, input.status);
    const items = await fulfillmentRepository.findItemsByFulfillmentId(id);

    return { ...updated, items };
  }

  async function getActiveFulfillments(orderId: string): Promise<Fulfillment[]> {
    const fulfillments = await fulfillmentRepository.findByOrderId(orderId);
    return fulfillments.find((f) => f.status !== 'cancelled') as unknown as Fulfillment[];
  }

  return {
    getFulfillmentById,
    getFulfillmentsByOrderId,
    createFulfillment,
    updateFulfillmentStatus,
    canCancel,
    getActiveFulfillments,
    calcShip,
  };
}

export type FulfillmentService = ReturnType<typeof createFulfillmentService>;
