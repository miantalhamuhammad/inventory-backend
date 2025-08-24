const PaymentsSchema = {
    tableName: 'payments',
    fields: {
        id: {
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            nullable: false,
        },
        payment_number: {
            type: 'VARCHAR(100)',
            unique: true,
            nullable: false,
        },
        reference_type: {
            type: 'ENUM("SALE_ORDER", "PURCHASE_ORDER", "INVOICE")',
            nullable: false,
        },
        reference_id: {
            type: 'INT',
            nullable: false,
        },
        payment_date: {
            type: 'DATE',
            nullable: false,
        },
        amount: {
            type: 'DECIMAL(15,2)',
            nullable: false,
        },
        payment_method: {
            type: 'ENUM("CASH", "CREDIT_CARD", "BANK_TRANSFER", "CHECK", "DIGITAL_WALLET")',
            nullable: false,
        },
        transaction_id: {
            type: 'VARCHAR(255)',
            nullable: true,
        },
        status: {
            type: 'ENUM("PENDING", "COMPLETED", "FAILED", "CANCELLED")',
            default: 'PENDING',
            nullable: false,
        },
        notes: {
            type: 'TEXT',
            nullable: true,
        },
        processed_by: {
            type: 'INT',
            foreignKey: {
                table: 'users',
                column: 'id',
            },
            nullable: false,
        },
        created_at: {
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP',
            nullable: false,
        },
        updated_at: {
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
            nullable: false,
        },
    },
    indexes: [
        { name: 'idx_payments_payment_number', columns: ['payment_number'] },
        { name: 'idx_payments_reference', columns: ['reference_type', 'reference_id'] },
        { name: 'idx_payments_payment_date', columns: ['payment_date'] },
        { name: 'idx_payments_status', columns: ['status'] },
        { name: 'idx_payments_transaction_id', columns: ['transaction_id'] },
    ],
};

export default PaymentsSchema;
