'use strict';

import bcrypt from 'bcrypt';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    console.log('🔄 Creating supplier user...');

    // First, ensure supplier role exists
    let supplierRoleId;
    const existingRoles = await queryInterface.sequelize.query(
      "SELECT id FROM roles WHERE name = 'supplier'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (existingRoles.length > 0) {
      supplierRoleId = existingRoles[0].id;
      console.log('✅ Found existing supplier role with ID:', supplierRoleId);
    } else {
      // Create supplier role if it doesn't exist
      await queryInterface.bulkInsert('roles', [{
        name: 'supplier',
        description: 'Supplier role for vendor portal access',
        created_at: new Date(),
        updated_at: new Date(),
      }]);

      const newRoles = await queryInterface.sequelize.query(
        "SELECT id FROM roles WHERE name = 'supplier'",
        { type: Sequelize.QueryTypes.SELECT }
      );
      supplierRoleId = newRoles[0].id;
      console.log('✅ Created new supplier role with ID:', supplierRoleId);
    }

    // Create a single supplier user with correct column names
    const supplierUser = {
      username: 'demo-supplier',
      email: 'demo@supplier.com',
      password_hash: await bcrypt.hash('supplier123', 10),
      role_id: supplierRoleId,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
    };

    // Insert the user
    await queryInterface.bulkInsert('users', [supplierUser]);

    // Get the inserted user ID
    const insertedUsers = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE email = 'demo@supplier.com'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (insertedUsers.length === 0) {
      throw new Error('Failed to create supplier user');
    }

    const userId = insertedUsers[0].id;

    // Create the corresponding supplier record
    const supplier = {
      supplier_name: 'Demo Supplier Co',
      supplier_id: 'SUP24DEMO',
      contact_person: 'Demo User',
      email: 'demo@supplier.com',
      phone_number: '+1-555-DEMO',
      address: '123 Demo Street',
      city: 'Demo City',
      state: 'CA',
      zip_code: '90210',
      country: 'United States',
      tax_id: 'TAX-DEMO-123',
      payment_terms: 'Net 30',
      category: 'General',
      status: 'ACTIVE',
      user_id: userId,
      notes: 'Demo supplier account for testing purposes.',
      created_at: new Date(),
      updated_at: new Date(),
    };

    await queryInterface.bulkInsert('suppliers', [supplier]);

    // Get warehouse ID for creating a sample PO
    const warehouses = await queryInterface.sequelize.query(
      'SELECT id FROM warehouses LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    let warehouseId = 1; // Default fallback
    if (warehouses.length > 0) {
      warehouseId = warehouses[0].id;
    } else {
      // Create a warehouse if none exists
      await queryInterface.bulkInsert('warehouses', [{
        warehouse_name: 'Demo Warehouse',
        warehouse_code: 'WH-DEMO',
        location: 'Demo Location',
        address: '456 Demo Avenue',
        city: 'Demo City',
        state: 'CA',
        zip_code: '90210',
        country: 'United States',
        created_at: new Date(),
        updated_at: new Date(),
      }]);

      const newWarehouses = await queryInterface.sequelize.query(
        'SELECT id FROM warehouses WHERE warehouse_code = "WH-DEMO"',
        { type: Sequelize.QueryTypes.SELECT }
      );
      warehouseId = newWarehouses[0].id;
    }

    // Get the created supplier ID
    const createdSuppliers = await queryInterface.sequelize.query(
      'SELECT id FROM suppliers WHERE supplier_id = "SUP24DEMO"',
      { type: Sequelize.QueryTypes.SELECT }
    );

    const supplierId = createdSuppliers[0].id;

    // Create a sample purchase order for the supplier
    const purchaseOrder = {
      po_number: 'PO-DEMO-001',
      supplier_id: supplierId,
      warehouse_id: warehouseId,
      order_date: new Date(),
      expected_delivery_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      status: 'PENDING',
      priority: 'MEDIUM',
      quotation_deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      subtotal: 5000.00,
      tax_amount: 500.00,
      discount_amount: 0.00,
      total_amount: 5500.00,
      payment_terms: 'Net 30',
      notes: 'Demo purchase order for testing supplier portal functionality.',
      created_at: new Date(),
      updated_at: new Date(),
    };

    await queryInterface.bulkInsert('purchase_orders', [purchaseOrder]);

    console.log('✅ Demo supplier user created successfully!');
    console.log('📧 Email: demo@supplier.com');
    console.log('🔑 Password: supplier123');
    console.log('🏢 Company: Demo Supplier Co');
    console.log('📋 Sample PO: PO-DEMO-001');
  },

  async down(queryInterface, Sequelize) {
    console.log('🔄 Removing demo supplier user...');

    // Remove purchase order
    await queryInterface.bulkDelete('purchase_orders', {
      po_number: 'PO-DEMO-001'
    });

    // Remove supplier
    await queryInterface.bulkDelete('suppliers', {
      supplier_id: 'SUP24DEMO'
    });

    // Remove user
    await queryInterface.bulkDelete('users', {
      email: 'demo@supplier.com'
    });

    // Remove demo warehouse if it was created
    await queryInterface.bulkDelete('warehouses', {
      warehouse_code: 'WH-DEMO'
    });

    console.log('✅ Demo supplier user removed successfully');
  }
};
