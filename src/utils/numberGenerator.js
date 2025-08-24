// Utility functions for generating unique numbers for various entities

import db from '../models/index.js';

const { SupplierQuotation, PurchaseOrder } = db;

// Generate unique quotation number
export const generateQuotationNumber = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');

    // Find the last quotation number for this month
    const lastQuotation = await SupplierQuotation.findOne({
        where: {
            quotation_number: {
                [db.Sequelize.Op.like]: `QUO-${year}${month}-%`
            }
        },
        order: [['quotation_number', 'DESC']]
    });

    let nextNumber = 1;
    if (lastQuotation) {
        const lastNumber = lastQuotation.quotation_number.split('-')[2];
        nextNumber = parseInt(lastNumber) + 1;
    }

    return `QUO-${year}${month}-${String(nextNumber).padStart(4, '0')}`;
};

// Generate unique PO number
export const generatePONumber = async () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const prefix = `PO-${year}${month}-`;

    try {
        // Find the last PO number with the current month pattern
        const lastPO = await PurchaseOrder.findOne({
            where: {
                po_number: {
                    [db.Sequelize.Op.like]: `${prefix}%`
                }
            },
            order: [['po_number', 'DESC']]
        });

        let nextNumber = 1;
        if (lastPO && lastPO.po_number) {
            // Extract the number part from PO-YYYYMM-XXXX format
            const parts = lastPO.po_number.split('-');
            if (parts.length === 3) {
                const lastNumber = parseInt(parts[2]);
                if (!isNaN(lastNumber)) {
                    nextNumber = lastNumber + 1;
                }
            }
        }

        const newPONumber = `${prefix}${String(nextNumber).padStart(4, '0')}`;

        // Double-check that this PO number doesn't exist (safety check)
        const existingPO = await PurchaseOrder.findOne({
            where: { po_number: newPONumber }
        });

        if (existingPO) {
            // If somehow it exists, increment and try again
            nextNumber++;
            return `${prefix}${String(nextNumber).padStart(4, '0')}`;
        }

        return newPONumber;

    } catch (error) {
        console.error('Error generating PO number:', error);
        // Fallback: use timestamp-based number if there's an error
        const timestamp = Date.now().toString().slice(-4);
        return `PO-${year}${month}-${timestamp}`;
    }
};

// Generate unique supplier ID
export const generateSupplierID = async () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);

    // Find the last supplier ID for this year
    const { Supplier } = db;
    const lastSupplier = await Supplier.findOne({
        where: {
            supplier_id: {
                [db.Sequelize.Op.like]: `SUP${year}%`
            }
        },
        order: [['supplier_id', 'DESC']]
    });

    let nextNumber = 1;
    if (lastSupplier) {
        const lastNumber = lastSupplier.supplier_id.slice(5);
        nextNumber = parseInt(lastNumber) + 1;
    }

    return `SUP${year}${String(nextNumber).padStart(4, '0')}`;
};
