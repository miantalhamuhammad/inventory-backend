'use strict';

/** @type {import('sequelize-cli').Migration} */
export default {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('shipments', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            shipment_number: {
                type: Sequelize.STRING(100),
                allowNull: false,
                unique: true,
            },
            sale_order_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'sale_orders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            warehouse_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'warehouses',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
            },
            carrier_name: {
                type: Sequelize.STRING(255),
                allowNull: true,
            },
            tracking_number: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            shipping_date: {
                type: Sequelize.DATEONLY,
                allowNull: false,
            },
            expected_delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            actual_delivery_date: {
                type: Sequelize.DATEONLY,
                allowNull: true,
            },
            status: {
                type: Sequelize.ENUM('PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'),
                allowNull: false,
                defaultValue: 'PREPARING',
            },
            shipping_cost: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0.00,
            },
            notes: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            created_by: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'RESTRICT',
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
        await queryInterface.addIndex('shipments', ['shipment_number'], {
            name: 'idx_shipments_shipment_number',
        });
        await queryInterface.addIndex('shipments', ['sale_order_id'], {
            name: 'idx_shipments_sale_order_id',
        });
        await queryInterface.addIndex('shipments', ['warehouse_id'], {
            name: 'idx_shipments_warehouse_id',
        });
        await queryInterface.addIndex('shipments', ['status'], {
            name: 'idx_shipments_status',
        });
        await queryInterface.addIndex('shipments', ['tracking_number'], {
            name: 'idx_shipments_tracking_number',
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable('shipments');
    },
};
