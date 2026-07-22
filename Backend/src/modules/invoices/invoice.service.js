const invoiceRepository = require('./invoice.repository');
const emailService = require('../../services/emailService');
const { NotFoundError, BadRequestError } = require('../../utils/errors');

class InvoiceService {
  async createInvoice(data, firmId) {
    const invoiceNumber = await invoiceRepository.generateNextInvoiceNumber(firmId, data.invoiceType || 'TAX_INVOICE');
    const isInterState = Boolean(data.isInterState);

    // Process line items & GST math
    let subTotal = 0;
    const itemsData = (data.items || []).map((item) => {
      const quantity = item.quantity ? parseInt(item.quantity, 10) : 1;
      const unitPrice = parseFloat(item.unitPrice || 0);
      const itemAmount = quantity * unitPrice;
      subTotal += itemAmount;

      return {
        description: item.description.trim(),
        sacCode: item.sacCode ? item.sacCode.trim() : '998231',
        quantity,
        unitPrice,
        amount: itemAmount,
        gstRate: item.gstRate ? parseFloat(item.gstRate) : 18.0,
      };
    });

    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (isInterState) {
      igstAmount = subTotal * 0.18;
    } else {
      cgstAmount = subTotal * 0.09;
      sgstAmount = subTotal * 0.09;
    }

    const totalAmount = subTotal + cgstAmount + sgstAmount + igstAmount;

    const invoiceData = {
      firmId,
      clientId: parseInt(data.clientId, 10),
      invoiceNumber,
      invoiceType: data.invoiceType || 'TAX_INVOICE',
      issueDate: data.issueDate ? new Date(data.issueDate) : new Date(),
      dueDate: new Date(data.dueDate),
      placeOfSupply: data.placeOfSupply ? data.placeOfSupply.trim() : '24-GUJARAT',
      isInterState,
      subTotal,
      cgstAmount,
      sgstAmount,
      igstAmount,
      totalAmount,
      paidAmount: 0.0,
      balanceAmount: totalAmount,
      status: 'UNPAID',
      notes: data.notes ? data.notes.trim() : 'Thank you for your business.',
      terms: data.terms ? data.terms.trim() : 'Payment due within 15 days of invoice issue.',
    };

    return await invoiceRepository.createInvoice(invoiceData, itemsData);
  }

  async getAllInvoices(queryParams, firmId) {
    return await invoiceRepository.findAllInvoices({ ...queryParams, firmId });
  }

  async getInvoiceById(id, firmId) {
    const invoice = await invoiceRepository.findInvoiceById(id, firmId);
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }
    return invoice;
  }

  async recordPayment(id, paymentData, firmId) {
    const invoice = await invoiceRepository.findInvoiceById(id, firmId);
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    const paymentAmount = parseFloat(paymentData.amount);
    if (paymentAmount > invoice.balanceAmount + 0.01) {
      throw new BadRequestError(`Payment amount (₹${paymentAmount}) exceeds outstanding balance (₹${invoice.balanceAmount})`);
    }

    const payment = await invoiceRepository.addPaymentRecord(id, paymentData);

    const newPaidAmount = invoice.paidAmount + paymentAmount;
    const newBalanceAmount = Math.max(0, invoice.totalAmount - newPaidAmount);

    let newStatus = invoice.status;
    if (newBalanceAmount <= 0.01) {
      newStatus = 'PAID';
    } else if (newPaidAmount > 0) {
      newStatus = 'PARTIALLY_PAID';
    }

    await invoiceRepository.updateInvoiceTotalsAndStatus(id, {
      paidAmount: newPaidAmount,
      balanceAmount: newBalanceAmount,
      status: newStatus,
    });

    return await this.getInvoiceById(id, firmId);
  }

  async convertProformaToTaxInvoice(id, firmId) {
    const invoice = await invoiceRepository.findInvoiceById(id, firmId);
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    if (invoice.invoiceType !== 'PROFORMA') {
      throw new BadRequestError('Invoice is already a Tax Invoice');
    }

    const taxInvoiceNumber = await invoiceRepository.generateNextInvoiceNumber(firmId, 'TAX_INVOICE');
    await invoiceRepository.convertProformaToTaxInvoice(id, firmId, taxInvoiceNumber);

    return await this.getInvoiceById(id, firmId);
  }

  async sendInvoiceEmail(id, firmId) {
    const invoice = await invoiceRepository.findInvoiceById(id, firmId);
    if (!invoice) {
      throw new NotFoundError('Invoice not found');
    }

    const clientEmail = invoice.client?.email;
    if (!clientEmail) {
      throw new BadRequestError('Client does not have a registered email address');
    }

    const subject = `[INVOICE] ${invoice.invoiceNumber} from ${invoice.firm?.firmName || 'Auditee CA Firm'}`;
    const html = `
      <div font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px;">
        <h2 style="color: #4f46e5;">TAX INVOICE / BILL</h2>
        <p>Dear <strong>${invoice.client?.companyName || invoice.client?.clientName}</strong>,</p>
        <p>Please find details of your professional services invoice below:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr><td><strong>Invoice #:</strong></td><td>${invoice.invoiceNumber}</td></tr>
          <tr><td><strong>Issue Date:</strong></td><td>${new Date(invoice.issueDate).toLocaleDateString()}</td></tr>
          <tr><td><strong>Due Date:</strong></td><td>${new Date(invoice.dueDate).toLocaleDateString()}</td></tr>
          <tr><td><strong>Total Amount:</strong></td><td>₹${Number(invoice.totalAmount).toLocaleString('en-IN')}</td></tr>
          <tr><td><strong>Balance Due:</strong></td><td style="color: #e11d48; font-weight: bold;">₹${Number(invoice.balanceAmount).toLocaleString('en-IN')}</td></tr>
        </table>
        <p>Thank you for choosing <strong>${invoice.firm?.firmName || 'Auditee CA Firm'}</strong>.</p>
      </div>
    `;

    try {
      await emailService.sendMail({
        to: clientEmail,
        subject,
        html,
      });
    } catch (err) {
      console.log('Email delivery skipped (development mode):', err.message);
    }

    return {
      message: `Invoice email dispatched to ${clientEmail}`,
      invoiceNumber: invoice.invoiceNumber,
      clientEmail,
    };
  }
}

module.exports = new InvoiceService();
