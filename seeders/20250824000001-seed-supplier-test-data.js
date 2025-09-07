'use strict';

import bcrypt from 'bcrypt';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    try {
      // Check if supplier test data already exists
      const existingSuppliers = await queryInterface.sequelize.query(
        "SELECT COUNT(*) as count FROM suppliers WHERE supplier_id IN ('SUP24001', 'SUP24002', 'SUP24003')",
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (existingSuppliers[0].count > 0) {
        console.log('Supplier test data already exists, skipping insertion');
        return;
      }

      // Get company IDs from database
      const companies = await queryInterface.sequelize.query(
        'SELECT id, name FROM companies ORDER BY id',
        { type: Sequelize.QueryTypes.SELECT }
      );

      // Use first company as default, or null if no companies exist
      const defaultCompanyId = companies.length > 0 ? companies[0].id : null;
      const secondCompanyId = companies.length > 1 ? companies[1].id : defaultCompanyId;

      // Get Admin user ID for created_by field
      const adminUsers = await queryInterface.sequelize.query(
        `SELECT u.id FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE r.name = 'Admin' 
         LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      let createdByUserId;
      if (adminUsers.length > 0) {
        createdByUserId = adminUsers[0].id;
      } else {
        // Fallback: get any user with id = 1 (typically admin)
        const fallbackUsers = await queryInterface.sequelize.query(
          "SELECT id FROM users WHERE id = 1 LIMIT 1",
          { type: Sequelize.QueryTypes.SELECT }
        );
        createdByUserId = fallbackUsers.length > 0 ? fallbackUsers[0].id : 1;
      }

      // Get supplier role ID
      const supplierRoles = await queryInterface.sequelize.query(
        "SELECT id FROM roles WHERE name = 'supplier'",
        { type: Sequelize.QueryTypes.SELECT }
      );

      let supplierRoleId;
      if (supplierRoles.length > 0) {
        supplierRoleId = supplierRoles[0].id;
      } else {
        // Create supplier role if it doesn't exist
        await queryInterface.bulkInsert('roles', [
          {
            name: 'supplier',
            description: 'Supplier user role',
            created_at: new Date(),
            updated_at: new Date()
          }
        ]);

// Fetch the newly created role
        const [newRole] = await queryInterface.sequelize.query(
          "SELECT id FROM roles WHERE name = 'supplier' LIMIT 1",
          { type: Sequelize.QueryTypes.SELECT }
        );
        supplierRoleId = newRole.id;

      }

      // Create supplier users first
      const supplierUsers = [
        {
          username: 'techsupplier',
          email: 'contact@techsupplier.com',
          password_hash: await bcrypt.hash('supplier123', 10),
          role_id: supplierRoleId,
          company_id: defaultCompanyId,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'globalsupplier',
          email: 'sales@globalsupplier.com',
          password_hash: await bcrypt.hash('supplier123', 10),
          role_id: supplierRoleId,
          company_id: secondCompanyId,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          username: 'premiumsupplier',
          email: 'info@premiumsupplier.com',
          password_hash: await bcrypt.hash('supplier123', 10),
          role_id: supplierRoleId,
          company_id: defaultCompanyId,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('users', supplierUsers);

      // Get the created supplier user IDs
      const createdSupplierUsers = await queryInterface.sequelize.query(
        `SELECT id, username FROM users WHERE username IN ('techsupplier', 'globalsupplier', 'premiumsupplier')`,
        { type: Sequelize.QueryTypes.SELECT }
      );

      const supplierUserMap = createdSupplierUsers.reduce((acc, user) => {
        acc[user.username] = user.id;
        return acc;
      }, {});

      // Create test suppliers with company assignments
      const suppliersToInsert = [
        {
          supplier_name: 'Tech Supplier Inc.',
          supplier_id: 'SUP24001',
          contact_person: 'John Smith',
          email: 'contact@techsupplier.com',
          phone_number: '+1-555-0123',
          address: '123 Tech Boulevard',
          city: 'San Francisco',
          state: 'CA',
          zip_code: '94105',
          country: 'USA',
          tax_id: 'TS123456789',
          payment_terms: 'Net 30',
          category: 'Electronics',
          notes: 'Reliable technology supplier with 15+ years experience',
          company_id: defaultCompanyId,
          user_id: supplierUserMap['techsupplier'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          supplier_name: 'Global Supply Chain Ltd.',
          supplier_id: 'SUP24002',
          contact_person: 'Maria Rodriguez',
          email: 'sales@globalsupplier.com',
          phone_number: '+1-555-0456',
          address: '456 Commerce Street',
          city: 'New York',
          state: 'NY',
          zip_code: '10001',
          country: 'USA',
          tax_id: 'GS987654321',
          payment_terms: 'Net 45',
          category: 'General',
          notes: 'International supplier with global reach',
          company_id: secondCompanyId,
          user_id: supplierUserMap['globalsupplier'],
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          supplier_name: 'Premium Parts & Components',
          supplier_id: 'SUP24003',
          contact_person: 'David Chen',
          email: 'info@premiumsupplier.com',
          phone_number: '+1-555-0789',
          address: '789 Industrial Park',
          city: 'Austin',
          state: 'TX',
          zip_code: '73301',
          country: 'USA',
          tax_id: 'PP456789123',
          payment_terms: 'Net 15',
          category: 'Components',
          notes: 'High-quality components and parts supplier',
          company_id: defaultCompanyId,
          user_id: supplierUserMap['premiumsupplier'],
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      await queryInterface.bulkInsert('suppliers', suppliersToInsert);

      console.log('✅ Supplier test data seeded successfully with company assignments');
      console.log('📝 Created suppliers:');
      console.log(`   1. Tech Supplier Inc. (Company: ${companies[0]?.name || 'Default'})`);
      console.log(`   2. Global Supply Chain Ltd. (Company: ${companies[1]?.name || companies[0]?.name || 'Default'})`);
      console.log(`   3. Premium Parts & Components (Company: ${companies[0]?.name || 'Default'})`);
      console.log('🔑 Supplier login credentials:');
      console.log('   techsupplier: contact@techsupplier.com / supplier123');
      console.log('   globalsupplier: sales@globalsupplier.com / supplier123');
      console.log('   premiumsupplier: info@premiumsupplier.com / supplier123');

    } catch (error) {
      console.error('❌ Error seeding supplier test data:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove suppliers
      await queryInterface.bulkDelete('suppliers', {
        supplier_id: ['SUP24001', 'SUP24002', 'SUP24003']
      });

      // Remove supplier users
      await queryInterface.bulkDelete('users', {
        username: ['techsupplier', 'globalsupplier', 'premiumsupplier']
      });

      console.log('✅ Supplier test data removed successfully');
    } catch (error) {
      console.error('❌ Error removing supplier test data:', error);
      throw error;
    }
  }
};
