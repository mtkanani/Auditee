const invoiceService = require('./invoice.service');

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
      const invoices = await invoiceService.getAllInvoices(req.query, firmId);
      return res.status(200).json({
        success: true,
        message: 'Invoices fetched successfully',
        data: invoices,
      });
    } catch (error) {
      next(error);
    }
  }

  async getInvoiceById(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      const invoice = await invoiceService.getInvoiceById(id, firmId);
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
      const invoice = await invoiceService.recordPayment(id, req.body, firmId);
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
}

module.exports = new InvoiceController();
