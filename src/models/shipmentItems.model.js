const ShipmentItemsSchema = {
    tableName: 'shipment_items',
    fields: {
        id: {
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            nullable: false,
        },
        shipment_id: {
            type: 'INT',
            foreignKey: {
                table: 'shipments',
                column: 'id',
                onDelete: 'CASCADE',
            },
            nullable: false,
        },
        product_id: {
            type: 'INT',
            foreignKey: {
                table: 'products',
                column: 'id',
            },
            nullable: false,
        },
        quantity: {
            type: 'INT',
            nullable: false,
        },
        notes: {
            type: 'TEXT',
            nullable: true,
        },
    },
    indexes: [
        { name: 'idx_shipment_items_shipment_id', columns: ['shipment_id'] },
        { name: 'idx_shipment_items_product_id', columns: ['product_id'] },
    ],
};

export default ShipmentItemsSchema;
