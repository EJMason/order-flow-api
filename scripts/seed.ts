import 'dotenv/config';
import { sql, closeDatabase } from '../src/shared/db.js';

async function seed(): Promise<void> {
  console.log('Starting database seed...\n');

  try {
    // Drop existing tables
    console.log('Dropping existing tables...');
    await sql`DROP TABLE IF EXISTS fulfillment_items CASCADE`;
    await sql`DROP TABLE IF EXISTS fulfillments CASCADE`;
    await sql`DROP TABLE IF EXISTS orders CASCADE`;
    await sql`DROP TABLE IF EXISTS products CASCADE`;
    await sql`DROP TABLE IF EXISTS reps CASCADE`;

    // Create tables
    console.log('Creating tables...');

    await sql`
      CREATE TABLE reps (
        id TEXT PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sku TEXT NOT NULL UNIQUE,
        price_cents INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE orders (
        id TEXT PRIMARY KEY,
        rep_id TEXT NOT NULL REFERENCES reps(id),
        status TEXT NOT NULL DEFAULT 'pending',
        total_cents INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE fulfillments (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        recipient_name TEXT NOT NULL,
        recipient_email TEXT,
        ship_to_address TEXT NOT NULL,
        ship_to_city TEXT NOT NULL,
        ship_to_state TEXT NOT NULL,
        ship_to_zip TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        tracking_number TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE fulfillment_items (
        id TEXT PRIMARY KEY,
        fulfillment_id TEXT NOT NULL REFERENCES fulfillments(id) ON DELETE CASCADE,
        product_id TEXT NOT NULL REFERENCES products(id),
        quantity INTEGER NOT NULL DEFAULT 1,
        unit_price_cents INTEGER NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Seed reps
    console.log('Seeding reps...');
    await sql`
      INSERT INTO reps (id, first_name, last_name, email, phone)
      VALUES 
        ('rep_001', 'Sarah', 'Johnson', 'sarah.johnson@example.com', '+15551234567'),
        ('rep_002', 'Mike', 'Chen', 'mike.chen@example.com', '+15559876543'),
        ('rep_003', 'Emily', 'Rodriguez', 'emily.rodriguez@example.com', '+15555551234')
    `;

    // Seed products
    console.log('Seeding products...');
    await sql`
      INSERT INTO products (id, name, sku, price_cents)
      VALUES 
        ('prod_001', 'Welcome Gift Box', 'GIFT-WELCOME-001', 4500),
        ('prod_002', 'Premium Thank You Package', 'GIFT-THANKYOU-001', 7500),
        ('prod_003', 'Celebration Bundle', 'GIFT-CELEBRATE-001', 12000),
        ('prod_004', 'Referral Reward Kit', 'GIFT-REFERRAL-001', 5000)
    `;

    // Seed orders
    console.log('Seeding orders...');
    await sql`
      INSERT INTO orders (id, rep_id, status, total_cents)
      VALUES 
        ('ord_001', 'rep_001', 'paid', 9000),
        ('ord_002', 'rep_002', 'pending', 7500),
        ('ord_003', 'rep_001', 'fulfilled', 12000)
    `;

    // Seed fulfillments
    console.log('Seeding fulfillments...');
    await sql`
      INSERT INTO fulfillments (id, order_id, recipient_name, recipient_email, ship_to_address, ship_to_city, ship_to_state, ship_to_zip, status, tracking_number)
      VALUES 
        ('ful_001', 'ord_001', 'John Smith', 'john.smith@customer.com', '123 Main St', 'Los Angeles', 'CA', '90210', 'shipped', '1Z999AA10123456784'),
        ('ful_002', 'ord_001', 'Jane Smith', 'jane.smith@customer.com', '456 Oak Ave', 'San Diego', 'CA', '92101', 'pending', NULL),
        ('ful_003', 'ord_002', 'Bob Wilson', 'bob.wilson@customer.com', '789 Pine Rd', 'Austin', 'TX', '78701', 'processing', NULL),
        ('ful_004', 'ord_003', 'Alice Brown', 'alice.brown@customer.com', '321 Elm St', 'Denver', 'CO', '80202', 'delivered', '1Z999AA10123456785')
    `;

    // Seed fulfillment items
    console.log('Seeding fulfillment items...');
    await sql`
      INSERT INTO fulfillment_items (id, fulfillment_id, product_id, quantity, unit_price_cents)
      VALUES 
        ('item_001', 'ful_001', 'prod_001', 1, 4500),
        ('item_002', 'ful_002', 'prod_001', 1, 4500),
        ('item_003', 'ful_003', 'prod_002', 1, 7500),
        ('item_004', 'ful_004', 'prod_003', 1, 12000)
    `;

    console.log('\n✅ Database seeded successfully!');
    console.log('   - 3 reps');
    console.log('   - 4 products');
    console.log('   - 3 orders');
    console.log('   - 4 fulfillments');
    console.log('   - 4 fulfillment items');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await closeDatabase();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
