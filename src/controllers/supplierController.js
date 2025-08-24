import supplierService from '../services/supplierService.js';

class SupplierController {
  async getProfile(req, res) {
    try {
      const userId = req.user.id; // Assuming user is attached to request from auth middleware
      const profile = await supplierService.getSupplierProfile(userId);

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      console.error('Error fetching supplier profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch supplier profile'
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const profileData = req.body;

      const updatedProfile = await supplierService.updateSupplierProfile(userId, profileData);

      res.status(200).json({
        success: true,
        data: updatedProfile,
        message: 'Profile updated successfully'
      });
    } catch (error) {
      console.error('Error updating supplier profile:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to update supplier profile'
      });
    }
  }

  // PO Requests endpoints
  async getPORequests(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const poRequests = await supplierService.getPORequests(userId, {
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.status(200).json({
        success: true,
        data: poRequests.data,
        pagination: poRequests.pagination
      });
    } catch (error) {
      console.error('Error fetching PO requests:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch PO requests'
      });
    }
  }

  async getPORequestDetail(req, res) {
    try {
      const userId = req.user.id;
      const poRequestId = req.params.id;

      const poRequest = await supplierService.getPORequestDetail(userId, poRequestId);

      res.status(200).json({
        success: true,
        data: poRequest
      });
    } catch (error) {
      console.error('Error fetching PO request detail:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch PO request detail'
      });
    }
  }

  // Quotations endpoints
  async getQuotations(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      const quotations = await supplierService.getQuotations(userId, {
        status,
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.status(200).json({
        success: true,
        data: quotations.data,
        pagination: quotations.pagination
      });
    } catch (error) {
      console.error('Error fetching quotations:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch quotations'
      });
    }
  }

  async submitQuotation(req, res) {
    try {
      const userId = req.user.id;
      const quotationData = req.body;

      const quotation = await supplierService.submitQuotation(userId, quotationData);

      res.status(201).json({
        success: true,
        data: quotation,
        message: 'Quotation submitted successfully'
      });
    } catch (error) {
      console.error('Error submitting quotation:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to submit quotation'
      });
    }
  }

  async getQuotationDetail(req, res) {
    try {
      const userId = req.user.id;
      const quotationId = req.params.id;

      const quotation = await supplierService.getQuotationDetail(userId, quotationId);

      res.status(200).json({
        success: true,
        data: quotation
      });
    } catch (error) {
      console.error('Error fetching quotation detail:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch quotation detail'
      });
    }
  }
}

export default new SupplierController();
