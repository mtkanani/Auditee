const prisma = require('../../config/db');

class InvoiceRepository {
  async generateNextInvoiceNumber(firmId, invoiceType = 'TAX_INVOICE') {
    const year = new Date().getFullYear();
    const prefix = invoiceType === 'PROFORMA' ? `PRO-${year}-` : `INV-${year}-`;

    const count = await prisma.invoice.count({
      where: {
        firmId,
        invoiceType,
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `${prefix}${sequence}`;
  }

  async createInvoice(invoiceData, itemsData) {
    return await prisma.invoice.create({
      data: {
        ...invoiceData,
        items: {
          create: itemsData,
        },
      },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true, gstNumber: true, panNumber: true } },
        items: true,
      },
    });
  }

  async findAllInvoices({ firmId, status, invoiceType, clientId, search }) {
    const where = { firmId, deletedAt: null };

    if (status) {
      where.status = status;
    }

    if (invoiceType) {
      where.invoiceType = invoiceType;
    }

    if (clientId) {
      where.clientId = parseInt(clientId, 10);
    }

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true, gstNumber: true } },
        items: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });

    return invoices;
  }

  async findInvoiceById(id, firmId) {
    return await prisma.invoice.findFirst({
      where: { id, firmId, deletedAt: null },
      include: {
        firm: { select: { id: true, firmName: true, email: true, phone: true, gstNumber: true, address: true, city: true, state: true } },
        client: { select: { id: true, clientName: true, companyName: true, email: true, phone: true, gstNumber: true, panNumber: true, billingAddress: true } },
        items: true,
        payments: { orderBy: { createdAt: 'desc' } },
      },
    });
  }

  async addPaymentRecord(invoiceId, { amount, paymentDate, paymentMode, referenceNumber, notes }) {
    return await prisma.paymentRecord.create({
      data: {
        invoiceId,
        amount: parseFloat(amount),
        paymentDate: paymentDate ? new Date(paymentDate) : new Date(),
        paymentMode: paymentMode || 'BANK_TRANSFER',
        referenceNumber: referenceNumber ? referenceNumber.trim() : null,
        notes: notes ? notes.trim() : null,
      },
    });
  }

  async updateInvoiceTotalsAndStatus(id, { paidAmount, balanceAmount, status }) {
    return await prisma.invoice.update({
      where: { id },
      data: {
        paidAmount,
        balanceAmount,
        status,
      },
    });
  }

  async convertProformaToTaxInvoice(id, firmId, newInvoiceNumber) {
    return await prisma.invoice.updateMany({
      where: { id, firmId, invoiceType: 'PROFORMA' },
      data: {
        invoiceType: 'TAX_INVOICE',
        invoiceNumber: newInvoiceNumber,
      },
    });
  }
}

module.exports = new InvoiceRepository();
