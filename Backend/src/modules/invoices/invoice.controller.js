const invoiceService = require('./invoice.service');

// Client users only ever see their own invoices; null for firm admins.
const clientScope = (user) => (user.role === 'CLIENT' ? user.clientId || user.id : null);

class InvoiceController {
  async createInvoice(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const invoice = await invoiceService.createInvoice(req.body, firmId);
      return res.status(201).json({
        success: true,
        message: 'Invoice created successfully',
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllInvoices(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const queryParams = { ...req.query };
      if (req.user.role === 'CLIENT') {
        queryParams.clientId = clientScope(req.user);
      }
      const { data, pagination, summary } = await invoiceService.getAllInvoices(queryParams, firmId);
      return res.status(200).json({
        success: true,
        message: 'Invoices fetched successfully',
        data,
        pagination,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInvoiceById(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const invoice = await invoiceService.getInvoiceById(id, firmId, clientScope(req.user));
      return res.status(200).json({
        success: true,
        message: 'Invoice details fetched successfully',
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  async recordPayment(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const invoice = await invoiceService.recordPayment(id, req.body, firmId, clientScope(req.user));
      return res.status(200).json({
        success: true,
        message: 'Payment recorded successfully',
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  async convertProforma(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const invoice = await invoiceService.convertProformaToTaxInvoice(id, firmId);
      return res.status(200).json({
        success: true,
        message: 'Proforma converted to Tax Invoice successfully',
        data: invoice,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendInvoiceEmail(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const result = await invoiceService.sendInvoiceEmail(id, firmId);
      return res.status(200).json({
        success: true,
        message: result.message,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getBankDetails(req, res, next) {
    try {
      const firmId = req.user.firmId || 1;
      const bankDetails = await invoiceService.getFirmBankDetails(firmId);
      return res.status(200).json({
        success: true,
        data: bankDetails,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateBankDetails(req, res, next) {
    try {
      const firmId = req.user.firmId || 1;
      const updated = await invoiceService.updateFirmBankDetails(firmId, req.body);
      return res.status(200).json({
        success: true,
        message: 'Firm bank & payment details updated successfully!',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new InvoiceController();
