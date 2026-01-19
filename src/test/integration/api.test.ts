/**
 * API Integration Tests
 *
 * End-to-end tests that hit the real database via HTTP requests.
 * Uses supertest to make requests to the Express app.
 *
 * Prerequisites:
 * - DATABASE_URL must be set
 * - Database must be seeded (npm run db:seed)
 *
 * Pattern: AAA (Arrange-Act-Assert)
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../../app.js';

const app = createApp();

// =============================================================================
// Health Check
// =============================================================================

describe('GET /health', () => {
  it('should return status ok with timestamp', async () => {
    // Arrange - nothing to arrange

    // Act
    const response = await request(app).get('/health');

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(new Date(response.body.timestamp)).toBeInstanceOf(Date);
  });
});

// =============================================================================
// Reps API (Read-Only)
// =============================================================================

describe('Reps API', () => {
  describe('GET /reps', () => {
    it('should return all reps', async () => {
      // Arrange - database should be seeded

      // Act
      const response = await request(app).get('/reps');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('first_name');
      expect(response.body[0]).toHaveProperty('last_name');
      expect(response.body[0]).toHaveProperty('email');
    });
  });

  describe('GET /reps/:id', () => {
    it('should return a rep when found', async () => {
      // Arrange
      const repId = 'rep_001';

      // Act
      const response = await request(app).get(`/reps/${repId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', repId);
      expect(response.body).toHaveProperty('first_name');
      expect(response.body).toHaveProperty('email');
    });

    it('should return 404 when rep not found', async () => {
      // Arrange
      const repId = 'nonexistent_rep';

      // Act
      const response = await request(app).get(`/reps/${repId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});

// =============================================================================
// Products API (Read-Only)
// =============================================================================

describe('Products API', () => {
  describe('GET /products', () => {
    it('should return all products', async () => {
      // Arrange - database should be seeded

      // Act
      const response = await request(app).get('/products');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('sku');
      expect(response.body[0]).toHaveProperty('price_cents');
    });
  });

  describe('GET /products/:id', () => {
    it('should return a product when found', async () => {
      // Arrange
      const productId = 'prod_001';

      // Act
      const response = await request(app).get(`/products/${productId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', productId);
      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('price_cents');
    });

    it('should return 404 when product not found', async () => {
      // Arrange
      const productId = 'nonexistent_product';

      // Act
      const response = await request(app).get(`/products/${productId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});

// =============================================================================
// Orders API
// =============================================================================

describe('Orders API', () => {
  describe('GET /orders', () => {
    it('should return all orders with rep names', async () => {
      // Arrange - database should be seeded

      // Act
      const response = await request(app).get('/orders');

      // Assert
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('rep_id');
      expect(response.body[0]).toHaveProperty('rep_name');
      expect(response.body[0]).toHaveProperty('status');
      expect(response.body[0]).toHaveProperty('total_cents');
    });
  });

  describe('GET /orders/:id', () => {
    it('should return an order with fulfillments when found', async () => {
      // Arrange
      const orderId = 'ord_001';

      // Act
      const response = await request(app).get(`/orders/${orderId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', orderId);
      expect(response.body).toHaveProperty('fulfillments');
      expect(Array.isArray(response.body.fulfillments)).toBe(true);
    });

    it('should return 404 when order not found', async () => {
      // Arrange
      const orderId = 'nonexistent_order';

      // Act
      const response = await request(app).get(`/orders/${orderId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('POST /orders', () => {
    it('should create a new order with fulfillment', async () => {
      // Arrange
      const newOrder = {
        rep_id: 'rep_001',
        fulfillment: {
          recipient_name: 'Test Customer',
          recipient_email: 'test@example.com',
          ship_to_address: '123 Test St',
          ship_to_city: 'Portland',
          ship_to_state: 'OR',
          ship_to_zip: '97201',
          items: [{ product_id: 'prod_001', quantity: 2 }],
        },
      };

      // Act
      const response = await request(app).post('/orders').send(newOrder);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toMatch(/^ord_/);
      expect(response.body).toHaveProperty('rep_id', 'rep_001');
      expect(response.body).toHaveProperty('total_cents', 9000); // 4500 * 2
      expect(response.body.fulfillments).toHaveLength(1);
      expect(response.body.fulfillments[0].items).toHaveLength(1);
    });

    it('should return 400 for invalid input', async () => {
      // Arrange
      const invalidOrder = {
        rep_id: '', // Invalid: empty
        fulfillment: {
          recipient_name: 'Test',
          ship_to_address: '123 Test St',
          ship_to_city: 'Portland',
          ship_to_state: 'OR',
          ship_to_zip: '97201',
          items: [], // Invalid: empty items
        },
      };

      // Act
      const response = await request(app).post('/orders').send(invalidOrder);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Validation failed');
    });

    it('should return 404 when rep does not exist', async () => {
      // Arrange
      const orderWithBadRep = {
        rep_id: 'nonexistent_rep',
        fulfillment: {
          recipient_name: 'Test Customer',
          ship_to_address: '123 Test St',
          ship_to_city: 'Portland',
          ship_to_state: 'OR',
          ship_to_zip: '97201',
          items: [{ product_id: 'prod_001', quantity: 1 }],
        },
      };

      // Act
      const response = await request(app).post('/orders').send(orderWithBadRep);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });
});

// =============================================================================
// Fulfillments API
// =============================================================================

describe('Fulfillments API', () => {
  describe('GET /fulfillments/:id', () => {
    it('should return a fulfillment with items when found', async () => {
      // Arrange
      const fulfillmentId = 'ful_001';

      // Act
      const response = await request(app).get(`/fulfillments/${fulfillmentId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', fulfillmentId);
      expect(response.body).toHaveProperty('items');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should return 404 when fulfillment not found', async () => {
      // Arrange
      const fulfillmentId = 'nonexistent_fulfillment';

      // Act
      const response = await request(app).get(`/fulfillments/${fulfillmentId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('code', 'NOT_FOUND');
    });
  });

  describe('PATCH /fulfillments/:id/status', () => {
    it('should update fulfillment status with valid transition', async () => {
      // Arrange - ful_002 is 'pending', can transition to 'processing'
      const fulfillmentId = 'ful_002';
      const statusUpdate = { status: 'processing' };

      // Act
      const response = await request(app)
        .patch(`/fulfillments/${fulfillmentId}/status`)
        .send(statusUpdate);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', fulfillmentId);
      expect(response.body).toHaveProperty('status', 'processing');
    });

    it('should return 400 for invalid status transition', async () => {
      // Arrange - ful_004 is 'delivered', cannot transition
      const fulfillmentId = 'ful_004';
      const statusUpdate = { status: 'pending' };

      // Act
      const response = await request(app)
        .patch(`/fulfillments/${fulfillmentId}/status`)
        .send(statusUpdate);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('Cannot transition');
    });
  });
});

// =============================================================================
// 404 Handling
// =============================================================================

describe('404 Handling', () => {
  it('should return 404 for unknown routes', async () => {
    // Arrange - nothing to arrange

    // Act
    const response = await request(app).get('/nonexistent-route');

    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Not found');
  });
});
