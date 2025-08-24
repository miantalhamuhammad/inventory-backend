'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('product_images', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            product_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            image_url: {
                type: Sequelize.STRING(500),
                allowNull: false,
            },
            is_primary: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes
        await queryInterface.addIndex('product_images', ['product_id'], {
            name: 'idx_product_images_product_id',
        });
        await queryInterface.addIndex('product_images', ['product_id', 'is_primary'], {
            name: 'idx_product_images_primary',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('product_images');
    },
};
