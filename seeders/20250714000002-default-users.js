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

            // Get company IDs from database
            const companies = await queryInterface.sequelize.query(
                'SELECT id, name FROM companies ORDER BY id',
                { type: Sequelize.QueryTypes.SELECT }
            );

            const roleMap = roles.reduce((acc, role) => {
                acc[role.name] = role.id;
                return acc;
            }, {});

            // Use first company as default, or null if no companies exist
            const defaultCompanyId = companies.length > 0 ? companies[0].id : null;
            const secondCompanyId = companies.length > 1 ? companies[1].id : defaultCompanyId;

            const usersToInsert = [];

            // Only add users if the corresponding roles exist
            if (roleMap['Super Admin']) {
                usersToInsert.push({
                    username: 'superadmin',
                    email: 'superadmin@gmail.com',
                    password_hash: hashedPassword,
                    role_id: roleMap['Super Admin'],
                    company_id: defaultCompanyId, // Super Admin for main company
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
                    company_id: defaultCompanyId, // Admin for main company
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
                    company_id: defaultCompanyId, // Manager for main company
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
                    company_id: defaultCompanyId, // Employee for main company
                    is_active: true,
                    created_at: new Date(),
                    updated_at: new Date(),
                });
            }

            // Add additional users for second company if it exists
            if (secondCompanyId && secondCompanyId !== defaultCompanyId) {
                if (roleMap['Admin']) {
                    usersToInsert.push({
                        username: 'admin_company2',
                        email: 'admin.company2@gmail.com',
                        password_hash: hashedPassword,
                        role_id: roleMap['Admin'],
                        company_id: secondCompanyId, // Admin for second company
                        is_active: true,
                        created_at: new Date(),
                        updated_at: new Date(),
                    });
                }

                if (roleMap['Manager']) {
                    usersToInsert.push({
                        username: 'manager_company2',
                        email: 'manager.company2@gmail.com',
                        password_hash: hashedPassword,
                        role_id: roleMap['Manager'],
                        company_id: secondCompanyId, // Manager for second company
                        is_active: true,
                        created_at: new Date(),
                        updated_at: new Date(),
                    });
                }
            }

            // Insert users only if there are users to insert
            if (usersToInsert.length > 0) {
                await queryInterface.bulkInsert('users', usersToInsert);

                console.log('✅ Users seeded successfully with company assignments');
                console.log('📝 Test credentials:');
                console.log(`   Super Admin: superadmin@gmail.com / 12345678 (Company: ${companies[0]?.name || 'Default'})`);
                console.log(`   Admin: admin@gmail.com / 12345678 (Company: ${companies[0]?.name || 'Default'})`);
                console.log(`   Manager: manager@gmail.com / 12345678 (Company: ${companies[0]?.name || 'Default'})`);
                console.log(`   Employee: employee@gmail.com / 12345678 (Company: ${companies[0]?.name || 'Default'})`);

                if (secondCompanyId && secondCompanyId !== defaultCompanyId) {
                    console.log(`   Admin (Company 2): admin.company2@gmail.com / 12345678 (Company: ${companies[1]?.name})`);
                    console.log(`   Manager (Company 2): manager.company2@gmail.com / 12345678 (Company: ${companies[1]?.name})`);
                }
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
