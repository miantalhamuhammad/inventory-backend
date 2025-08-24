'use strict';

import bcrypt from 'bcrypt';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Create supplier users
    const supplierUsers = [
      {
        name: 'ABC Supplies Ltd',
        email: 'contact@abcsupplies.com',
        password: await bcrypt.hash('supplier123', 10),
        role: 'supplier',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'XYZ Manufacturing',
        email: 'sales@xyzmanufacturing.com',
        password: await bcrypt.hash('supplier123', 10),
        role: 'supplier',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Global Tech Solutions',
        email: 'info@globaltechsol.com',
        password: await bcrypt.hash('supplier123', 10),
        role: 'supplier',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('users', supplierUsers);

    // Get the inserted user IDs
    const insertedUsers = await queryInterface.sequelize.query(
      "SELECT id, email FROM users WHERE role = 'supplier'",
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Create suppliers linked to users
    const suppliers = [
      {
        supplier_name: 'ABC Supplies Ltd',
        supplier_id: 'SUP24001',
        contact_person: 'John Smith',
        email: 'contact@abcsupplies.com',
        phone_number: '+1-555-0123',
        address: '123 Industrial Avenue',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        country: 'United States',
        tax_id: 'TAX123456789',
        payment_terms: 'Net 30',
        category: 'Manufacturing',
        status: 'ACTIVE',
        user_id: insertedUsers.find(u => u.email === 'contact@abcsupplies.com').id,
        notes: 'Reliable supplier for industrial equipment and materials.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        supplier_name: 'XYZ Manufacturing',
        supplier_id: 'SUP24002',
        contact_person: 'Jane Doe',
        email: 'sales@xyzmanufacturing.com',
        phone_number: '+1-555-0124',
        address: '456 Manufacturing Blvd',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60601',
        country: 'United States',
        tax_id: 'TAX987654321',
        payment_terms: 'Net 15',
        category: 'Electronics',
        status: 'ACTIVE',
        user_id: insertedUsers.find(u => u.email === 'sales@xyzmanufacturing.com').id,
        notes: 'Specialized in electronic components and assemblies.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        supplier_name: 'Global Tech Solutions',
        supplier_id: 'SUP24003',
        contact_person: 'Mike Johnson',
        email: 'info@globaltechsol.com',
        phone_number: '+1-555-0125',
        address: '789 Technology Park',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        country: 'United States',
        tax_id: 'TAX456789123',
        payment_terms: 'Net 30',
        category: 'Technology',
        status: 'ACTIVE',
        user_id: insertedUsers.find(u => u.email === 'info@globaltechsol.com').id,
        notes: 'Provider of cutting-edge technology solutions and hardware.',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('suppliers', suppliers);

    // Get supplier IDs for creating purchase orders
    const insertedSuppliers = await queryInterface.sequelize.query(
      'SELECT id, supplier_id FROM suppliers',
      { type: Sequelize.QueryTypes.SELECT }
    );

    // Get warehouse ID (assuming at least one warehouse exists)
    const warehouses = await queryInterface.sequelize.query(
      'SELECT id FROM warehouses LIMIT 1',
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (warehouses.length === 0) {
      // Create a default warehouse if none exists
      await queryInterface.bulkInsert('warehouses', [
        {
          warehouse_name: 'Main Warehouse',
          warehouse_code: 'WH001',
          location: 'New York',
          address: '100 Storage Street',
          city: 'New York',
          state: 'NY',
          zip_code: '10001',
          country: 'United States',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }

    const warehouseId = warehouses.length > 0 ? warehouses[0].id : 1;

    // Create sample purchase orders
    const purchaseOrders = [
      {
        po_number: 'PO-2024-001',
        supplier_id: insertedSuppliers[0].id,
        warehouse_id: warehouseId,
        order_date: new Date('2024-08-20'),
        expected_delivery_date: new Date('2024-09-05'),
        status: 'PENDING',
        priority: 'HIGH',
        quotation_deadline: new Date('2024-08-30'),
        subtotal: 15000.00,
        tax_amount: 1500.00,
        discount_amount: 0.00,
        total_amount: 16500.00,
        payment_terms: 'Net 30',
        notes: 'Urgent requirement for ongoing project. Quality certificates required.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        po_number: 'PO-2024-002',
        supplier_id: insertedSuppliers[1].id,
        warehouse_id: warehouseId,
        order_date: new Date('2024-08-22'),
        expected_delivery_date: new Date('2024-09-10'),
        status: 'QUOTATION_REQUESTED',
        priority: 'MEDIUM',
        quotation_deadline: new Date('2024-09-01'),
        subtotal: 8500.00,
        tax_amount: 850.00,
        discount_amount: 100.00,
        total_amount: 9250.00,
        payment_terms: 'Net 15',
        notes: 'Standard quality acceptable. Bulk packaging preferred.',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        po_number: 'PO-2024-003',
        supplier_id: insertedSuppliers[2].id,
        warehouse_id: warehouseId,
        order_date: new Date('2024-08-24'),
        expected_delivery_date: new Date('2024-09-15'),
        status: 'PENDING',
        priority: 'LOW',
        quotation_deadline: new Date('2024-09-05'),
        subtotal: 3200.00,
        tax_amount: 320.00,
        discount_amount: 0.00,
        total_amount: 3520.00,
        payment_terms: 'Net 30',
        notes: 'Required for new employee onboarding and safety compliance.',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('purchase_orders', purchaseOrders);

    console.log('✅ Supplier test data seeded successfully');
  },

  async down(queryInterface, Sequelize) {
    // Remove purchase orders first (due to foreign key constraints)
    await queryInterface.bulkDelete('purchase_orders', {
      po_number: {
        [Sequelize.Op.in]: ['PO-2024-001', 'PO-2024-002', 'PO-2024-003']
      }
    });

    // Remove suppliers
    await queryInterface.bulkDelete('suppliers', {
      supplier_id: {
        [Sequelize.Op.in]: ['SUP24001', 'SUP24002', 'SUP24003']
      }
    });

    // Remove supplier users
    await queryInterface.bulkDelete('users', {
      email: {
        [Sequelize.Op.in]: [
          'contact@abcsupplies.com',
          'sales@xyzmanufacturing.com',
          'info@globaltechsol.com'
        ]
      }
    });

    console.log('✅ Supplier test data removed successfully');
  }
};
