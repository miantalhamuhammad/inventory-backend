import bcrypt from 'bcrypt';
import db from '../models/index.js';

class SupplierRegistrationController {
  static async registerSupplier(req, res, next) {
    try {
      const {
        // User account data (required)
        username,
        email,
        password,

        // Supplier profile data (required fields)
        companyName,
        contactPerson,
        phone,

        // Optional fields
        businessLicense,
        taxId,
        website,
        companyType,
        alternatePhone,
        address,
        city,
        state,
        zipCode,
        country,
        businessCategory,
        yearsInBusiness,
        annualRevenue,
        paymentTerms,
        notes
      } = req.body;

      // Validation for required fields
      if (!username || !email || !password || !companyName || !contactPerson || !phone) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: username, email, password, companyName, contactPerson, and phone are required'
        });
      }

      // Check if user already exists
      const existingUser = await db.User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
      }

      // Check if username is taken
      const existingUsername = await db.User.findOne({ where: { username } });
      if (existingUsername) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }

      // Find supplier role ID
      const supplierRole = await db.Role.findOne({ where: { name: 'supplier' } });
      if (!supplierRole) {
        return res.status(500).json({
          success: false,
          message: 'Supplier role not found in system'
        });
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Create user and supplier in a transaction
      const result = await db.sequelize.transaction(async (t) => {
        // Create user account
        const user = await db.User.create({
          username,
          email,
          password_hash: hashedPassword,
          role_id: supplierRole.id,
          is_active: false // Set to false initially - pending approval
        }, { transaction: t });

        // Generate unique supplier ID
        const supplierCount = await db.Supplier.count({ transaction: t });
        const supplierId = `SUP${String(supplierCount + 1).padStart(6, '0')}`;

        // Create supplier profile
        const supplier = await db.Supplier.create({
          supplier_name: companyName,
          supplier_id: supplierId,
          contact_person: contactPerson,
          email,
          phone_number: phone,
          address: address || null,
          city: city || null,
          state: state || null,
          zip_code: zipCode || null,
          country: country || null,
          tax_id: taxId || null,
          payment_terms: paymentTerms || null,
          category: businessCategory || null,
          notes: notes || null,
          user_id: user.id
        }, { transaction: t });

        return { user, supplier };
      });

      // Return success response without sensitive data
      const response = {
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          is_active: result.user.is_active
        },
        supplier: {
          id: result.supplier.id,
          supplier_id: result.supplier.supplier_id,
          supplier_name: result.supplier.supplier_name,
          contact_person: result.supplier.contact_person
        }
      };

      res.status(201).json({
        success: true,
        message: 'Supplier registration successful! Your account is pending approval.',
        data: response
      });

    } catch (error) {
      console.error('Supplier registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error during registration'
      });
    }
  }
}

export default SupplierRegistrationController;
