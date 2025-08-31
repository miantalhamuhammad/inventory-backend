'use strict';

import bcrypt from 'bcrypt';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        try {
            // Check if users already exist
            const existingUsers = await queryInterface.sequelize.query(
                'SELECT COUNT(*) as count FROM users',
                { type: Sequelize.QueryTypes.SELECT }
            );

            if (existingUsers[0].count > 0) {
                console.log('Users already exist, skipping user insertion');
                return;
            }

            // Hash the password only once
            const plainPassword = '12345678';
            const hashedPassword = await bcrypt.hash(plainPassword, 10);

            // Get role IDs from database instead of using hardcoded values
            const roles = await queryInterface.sequelize.query(
                'SELECT id, name FROM roles',
                { type: Sequelize.QueryTypes.SELECT }
            );

            const roleMap = roles.reduce((acc, role) => {
                acc[role.name] = role.id;
                return acc;
            }, {});

            const usersToInsert = [];

            // Only add users if the corresponding roles exist
            if (roleMap['Super Admin']) {
                usersToInsert.push({
                    username: 'superadmin',
                    email: 'superadmin@gmail.com',
                    password_hash: hashedPassword,
                    role_id: roleMap['Super Admin'],
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }

            if (roleMap['Admin']) {
                usersToInsert.push({
                    username: 'admin',
                    email: 'admin@gmail.com',
                    password_hash: hashedPassword,
                    role_id: roleMap['Admin'],
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }

            if (roleMap['Manager']) {
                usersToInsert.push({
                    username: 'manager',
                    email: 'manager@gmail.com',
                    password_hash: hashedPassword,
                    role_id: roleMap['Manager'],
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }

            if (roleMap['Employee']) {
                usersToInsert.push({
                    username: 'employee',
                    email: 'employee@gmail.com',
                    password_hash: hashedPassword,
                    role_id: roleMap['Employee'],
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }

            // Insert users only if there are users to insert
            if (usersToInsert.length > 0) {
                await queryInterface.bulkInsert('users', usersToInsert);

                console.log('✅ Users seeded successfully');
                console.log('📝 Test credentials (Password: 12345678):');
                console.log('   Super Admin: superadmin@gmail.com');
                console.log('   Admin: admin@gmail.com');
                console.log('   Manager: manager@gmail.com');
                console.log('   Employee: employee@gmail.com');
            }
        } catch (error) {
            console.error('❌ Error seeding users:', error);
            throw error;
        }
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.bulkDelete('users', null, {});
    },
};
