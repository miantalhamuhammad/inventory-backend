'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('products', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            product_name: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            sku_code: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            barcode_number: {
                type: Sequelize.STRING(100),
                allowNull: true,
                unique: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            category_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'categories',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            supplier_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'suppliers',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            weight: {
                type: Sequelize.DECIMAL(10, 3),
                allowNull: true,
            },
            weight_unit: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            dimensions: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            dimension_unit: {
                type: Sequelize.STRING(20),
                allowNull: true,
            },
            purchasing_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            selling_price_margin: {
                type: Sequelize.DECIMAL(5, 2),
                allowNull: true,
            },
            selling_price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            image_url: {
                type: Sequelize.STRING(500),
                allowNull: true,
            },
            grn_number: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        // Add indexes
        await queryInterface.addIndex('products', ['sku_code'], {
            name: 'idx_products_sku',
        });
        await queryInterface.addIndex('products', ['barcode_number'], {
            name: 'idx_products_barcode',
        });
        await queryInterface.addIndex('products', ['category_id'], {
            name: 'idx_products_category_id',
        });
        await queryInterface.addIndex('products', ['supplier_id'], {
            name: 'idx_products_supplier_id',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('products');
    },
};
