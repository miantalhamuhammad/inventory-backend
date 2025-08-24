'use strict';

import bcrypt from 'bcrypt';

/** @type {import('sequelize-cli').Migration} */
const userSeeder = {
    async up(queryInterface, _Sequelize) {
        try {
            // Hash the password only once
            const plainPassword = '12345678';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Insert default users with different roles
            await queryInterface.bulkInsert('users', [
                {
                    username: 'superadmin',
                    email: 'superadmin@gmail.com',
                    password_hash: hashedPassword,
                    role_id: 1, // Super Admin role
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    username: 'admin',
                    email: 'admin@gmail.com',
                    password_hash: hashedPassword,
                    role_id: 2, // Admin role
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    username: 'manager',
                    email: 'manager@gmail.com',
                    password_hash: hashedPassword,
                    role_id: 3, // Manager role
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                    username: 'employee',
                    email: 'employee@gmail.com',
                    password_hash: hashedPassword,
                    role_id: 4, // Employee role
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                },
            ]);

            console.log('✅ Users seeded successfully');
            console.log('📝 Test credentials (Password: 12345678):');
            console.log('   Super Admin: superadmin@gmail.com');
            console.log('   Admin: admin@gmail.com');
            console.log('   Manager: manager@gmail.com');
            console.log('   Employee: employee@gmail.com');
        } catch (error) {
            console.error('❌ Error seeding users:', error);
            throw error;
        }
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    },
};

export default userSeeder;
