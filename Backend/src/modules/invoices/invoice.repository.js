const prisma = require('../../config/db');
const { parsePagination, findManyPaginated } = require('../../utils/pagination');

class InvoiceRepository {
  /**
   * Next number for the firm, type and year, e.g. INV-2026-0042. One atomic upsert: concurrent
   * invoices each get their own number, and deleted invoices never free a number for reuse.
   * The first time a firm/type/year is used, the counter starts after the highest existing number
   * with that prefix, so numbering carries on from invoices made before the counter existed.
   */
  async generateNextInvoiceNumber(firmId, invoiceType = 'TAX_INVOICE') {
    const year = new Date().getFullYear();
    const prefix = invoiceType === 'PROFORMA' ? `PRO-${year}-` : `INV-${year}-`;
    const pattern = `^${prefix}[0-9]+$`;

    const [row] = await prisma.$queryRaw`
      INSERT INTO "invoice_counters" ("firmId", "invoiceType", "year", "lastNumber", "updatedAt")
      VALUES (
        ${firmId},
        ${invoiceType}::"InvoiceType",
        ${year},
        (
          SELECT COALESCE(MAX(CAST(SUBSTRING("invoiceNumber" FROM ${prefix.length + 1}::int) AS INTEGER)), 0) + 1
          FROM "invoices"
          WHERE "firmId" = ${firmId} AND "invoiceNumber" ~ ${pattern}
        ),
        NOW()
      )
      ON CONFLICT ("firmId", "invoiceType", "year")
      DO UPDATE SET "lastNumber" = "invoice_counters"."lastNumber" + 1, "updatedAt" = NOW()
      RETURNING "lastNumber"
    `;

    return `${prefix}${String(row.lastNumber).padStart(4, '0')}`;
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

  async findAllInvoices({ firmId, status, invoiceType, clientId, search, page, limit }) {
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

    // List views only need totals; items and payments are loaded by findInvoiceById.
    const listArgs = {
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true, gstNumber: true } },
      },
    };

    // Summary cards cover every matching invoice, not just the current page.
    const [result, sums, overdueCount, pendingCount] = await Promise.all([
      findManyPaginated(prisma.invoice, listArgs, parsePagination({ page, limit })),
      prisma.invoice.aggregate({
        where,
        _sum: { totalAmount: true, paidAmount: true, balanceAmount: true },
      }),
      prisma.invoice.count({
        where: {
          AND: [where, { OR: [{ status: 'OVERDUE' }, { dueDate: { lt: new Date() }, status: { not: 'PAID' } }] }],
        },
      }),
      prisma.invoice.count({ where: { AND: [where, { status: { not: 'PAID' } }] } }),
    ]);

    return {
      ...result,
      summary: {
        totalAmount: sums._sum.totalAmount || 0,
        paidAmount: sums._sum.paidAmount || 0,
        balanceAmount: sums._sum.balanceAmount || 0,
        overdueCount,
        pendingCount,
      },
    };
  }

  async findInvoiceById(id, firmId) {
    return await prisma.invoice.findFirst({
      where: { id, firmId, deletedAt: null },
      include: {
        firm: { select: { id: true, firmName: true, email: true, phone: true, address: true, city: true, state: true } },
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
