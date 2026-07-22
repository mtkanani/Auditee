const prisma = require('../../config/db');

class ComplianceRepository {
  async createComplianceItem(data) {
    return await prisma.complianceItem.create({
      data,
      include: {
        client: { select: { id: true, clientName: true, companyName: true, gstNumber: true } },
      },
    });
  }

  async findAllComplianceItems({ firmId, category, status, clientId, search }) {
    const where = { firmId };

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (clientId) {
      where.clientId = parseInt(clientId, 10);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { period: { contains: search, mode: 'insensitive' } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const items = await prisma.complianceItem.findMany({
      where,
      orderBy: { dueDate: 'asc' },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, gstNumber: true, email: true } },
      },
    });

    return items;
  }

  async findComplianceById(id, firmId) {
    return await prisma.complianceItem.findFirst({
      where: { id, firmId },
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true } },
      },
    });
  }

  async updateComplianceItem(id, firmId, data) {
    return await prisma.complianceItem.updateMany({
      where: { id, firmId },
      data,
    });
  }

  async deleteComplianceItem(id, firmId) {
    return await prisma.complianceItem.deleteMany({
      where: { id, firmId },
    });
  }

  // --- Indian Master Statutory Deadlines Generator ---
  async generateIndianStatutoryPresets(firmId, year, month) {
    const monthStr = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });
    const periodName = `${monthStr} ${year}`;

    // Helper to format ISO date strings for target month/day
    const makeDate = (day) => new Date(year, month - 1, day);

    const statutoryPresets = [
      // GST Category
      {
        firmId,
        title: `GSTR-1 Monthly Return Filing (${periodName})`,
        category: 'GST',
        dueDate: makeDate(11),
        period: periodName,
        priority: 'HIGH',
        status: 'UPCOMING',
        penaltyDetails: 'Late Fee: ₹50/day (₹20/day for Nil return) under Sec 47 of CGST Act.',
      },
      {
        firmId,
        title: `GSTR-3B Summary Return & Tax Payment (${periodName})`,
        category: 'GST',
        dueDate: makeDate(20),
        period: periodName,
        priority: 'URGENT',
        status: 'UPCOMING',
        penaltyDetails: 'Late Fee: ₹50/day + 18% Interest p.a. on unpaid tax liability.',
      },
      // TDS Category
      {
        firmId,
        title: `TDS / TCS Monthly Challan Deposit 281 (${monthStr})`,
        category: 'TDS',
        dueDate: makeDate(7),
        period: periodName,
        priority: 'HIGH',
        status: 'UPCOMING',
        penaltyDetails: '1.5% Interest per month for delay in payment under Sec 201(1A).',
      },
      {
        firmId,
        title: `Quarterly TDS Return Form 26Q / 24Q Filing`,
        category: 'TDS',
        dueDate: makeDate(31),
        period: periodName,
        priority: 'HIGH',
        status: 'UPCOMING',
        penaltyDetails: 'Late fee: ₹200/day under Section 234E of Income Tax Act.',
      },
      // PF & ESI Category
      {
        firmId,
        title: `EPF Monthly Electronic Challan cum Return (ECR)`,
        category: 'PF_ESI',
        dueDate: makeDate(15),
        period: periodName,
        priority: 'MEDIUM',
        status: 'UPCOMING',
        penaltyDetails: 'Damages under Sec 14B (5% to 25% p.a.) + Interest under Sec 7Q.',
      },
      {
        firmId,
        title: `ESIC Monthly Contribution Return Payment`,
        category: 'PF_ESI',
        dueDate: makeDate(15),
        period: periodName,
        priority: 'MEDIUM',
        status: 'UPCOMING',
        penaltyDetails: '12% Interest p.a. for delay in ESIC contribution payment.',
      },
      // Income Tax & Audit Category
      {
        firmId,
        title: `Form 3CD Tax Audit Report Preparation & Filing`,
        category: 'INCOME_TAX',
        dueDate: makeDate(30),
        period: `FY ${year - 1}-${year.toString().slice(-2)}`,
        priority: 'URGENT',
        status: 'UPCOMING',
        penaltyDetails: 'Penalty under Sec 271B: 0.5% of turnover up to ₹1,50,000.',
      },
      {
        firmId,
        title: `Income Tax Return Filing for Corporate / Tax Audit Cases`,
        category: 'INCOME_TAX',
        dueDate: makeDate(31),
        period: `AY ${year}-${year + 1}`,
        priority: 'URGENT',
        status: 'UPCOMING',
        penaltyDetails: 'Late fee under Sec 234F: ₹5,000 + Sec 234A interest.',
      },
      // ROC / MCA Category
      {
        firmId,
        title: `ROC AOC-4 Annual Financial Statements Filing`,
        category: 'ROC_MCA',
        dueDate: makeDate(30),
        period: periodName,
        priority: 'HIGH',
        status: 'UPCOMING',
        penaltyDetails: 'Additional fee: ₹100 per day till the date of filing.',
      },
      {
        firmId,
        title: `ROC MGT-7 / MGT-7A Annual Return Filing`,
        category: 'ROC_MCA',
        dueDate: makeDate(29),
        period: periodName,
        priority: 'HIGH',
        status: 'UPCOMING',
        penaltyDetails: 'Additional fee: ₹100 per day under Companies Act 2013.',
      },
    ];

    const created = await prisma.complianceItem.createMany({
      data: statutoryPresets,
      skipDuplicates: true,
    });

    return created;
  }
}

module.exports = new ComplianceRepository();
