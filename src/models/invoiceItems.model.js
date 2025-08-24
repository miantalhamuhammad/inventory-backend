const InvoiceItemsSchema = {
    tableName: 'invoice_items',
    fields: {
        id: {
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            nullable: false,
        },
        invoice_id: {
            type: 'INT',
            foreignKey: {
                table: 'invoices',
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
        unit_price: {
            type: 'DECIMAL(10,2)',
            nullable: false,
        },
        total_price: {
            type: 'DECIMAL(15,2)',
            generated: 'AS (quantity * unit_price) STORED',
            nullable: false,
        },
        notes: {
            type: 'TEXT',
            nullable: true,
        },
    },
    indexes: [
        { name: 'idx_invoice_items_invoice_id', columns: ['invoice_id'] },
        { name: 'idx_invoice_items_product_id', columns: ['product_id'] },
    ],
};

export default InvoiceItemsSchema;
