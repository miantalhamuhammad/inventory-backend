'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    try {
      // Check if companies already exist
      const existingCompanies = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM companies',
        { type: Sequelize.QueryTypes.SELECT }
      );

      if (existingCompanies[0].count > 0) {
        console.log('Companies already exist, skipping company insertion');
        return;
      }

      const companiesToInsert = [
        {
          name: 'Acme Corporation',
          address: '123 Business Street, Tech City, CA 90210',
          phone: '+1 (555) 123-4567',
          email: 'contact@acme.com',
          website: 'https://www.acme.com',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'TechFlow Industries',
          address: '456 Innovation Ave, Silicon Valley, CA 94105',
          phone: '+1 (555) 987-6543',
          email: 'info@techflow.com',
          website: 'https://www.techflow.com',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Global Supply Co',
          address: '789 Commerce Blvd, Business District, NY 10001',
          phone: '+1 (555) 456-7890',
          email: 'hello@globalsupply.com',
          website: 'https://www.globalsupply.com',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        }
      ];

      await queryInterface.bulkInsert('companies', companiesToInsert);

      console.log('✅ Companies seeded successfully');
      console.log('📝 Created companies:');
      console.log('   1. Acme Corporation');
      console.log('   2. TechFlow Industries');
      console.log('   3. Global Supply Co');

    } catch (error) {
      console.error('❌ Error seeding companies:', error);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('companies', null, {});
      console.log('✅ Companies seed data removed successfully');
    } catch (error) {
      console.error('❌ Error removing companies seed data:', error);
      throw error;
    }
  }
};
