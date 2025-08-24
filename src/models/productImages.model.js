const ProductImagesSchema = {
    tableName: 'product_images',
    fields: {
        id: {
            type: 'INT',
            primaryKey: true,
            autoIncrement: true,
            nullable: false,
        },
        product_id: {
            type: 'INT',
            foreignKey: {
                table: 'products',
                column: 'id',
                onDelete: 'CASCADE',
            },
            nullable: false,
        },
        image_url: {
            type: 'VARCHAR(500)',
            nullable: false,
        },
        is_primary: {
            type: 'BOOLEAN',
            default: false,
            nullable: false,
        },
        created_at: {
            type: 'TIMESTAMP',
            default: 'CURRENT_TIMESTAMP',
            nullable: false,
        },
    },
    indexes: [
        { name: 'idx_product_images_product_id', columns: ['product_id'] },
        { name: 'idx_product_images_primary', columns: ['product_id', 'is_primary'] },
    ],
};

export default ProductImagesSchema;
