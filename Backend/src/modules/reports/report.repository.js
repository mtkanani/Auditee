const prisma = require('../../config/db');

class ReportRepository {
  /**
   * Helper to parse date range filters
   */
  _getDateRangeFilter(dateRange, customStart, customEnd) {
    const now = new Date();
    let startDate = null;
    let endDate = null;

    if (dateRange === 'today') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    } else if (dateRange === 'this_week') {
      const dayOfWeek = now.getDay(); // 0 is Sunday
      const diffToMonday = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diffToMonday));
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date();
    } else if (dateRange === 'this_month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date();
    } else if (dateRange === 'this_quarter') {
      const currentQuarter = Math.floor(now.getMonth() / 3);
      startDate = new Date(now.getFullYear(), currentQuarter * 3, 1);
      endDate = new Date();
    } else if (dateRange === 'this_year') {
      startDate = new Date(now.getFullYear(), 0, 1);
      endDate = new Date();
    } else if (dateRange === 'custom' && (customStart || customEnd)) {
      if (customStart) startDate = new Date(customStart);
      if (customEnd) {
        endDate = new Date(customEnd);
        endDate.setHours(23, 59, 59, 999);
      }
    }

    const dateFilter = {};
    if (startDate) dateFilter.gte = startDate;
    if (endDate) dateFilter.lte = endDate;

    return Object.keys(dateFilter).length > 0 ? dateFilter : null;
  }

  /**
   * High-level summary metrics overview
   */
  async getSummaryOverview(firmId) {
    const whereFirm = firmId ? { firmId: Number(firmId) } : {};

    const [
      totalPendingTasks,
      totalCompletedTasks,
      totalClients,
      totalEmployees,
      totalInvoices,
      unpaidInvoices,
      totalComplianceItems,
      overdueComplianceItems,
    ] = await Promise.all([
      prisma.task.count({
        where: {
          ...whereFirm,
          deletedAt: null,
          status: { in: ['PENDING', 'IN_PROGRESS', 'OVERDUE', 'REOPENED'] },
        },
      }),
      prisma.task.count({
        where: {
          ...whereFirm,
          deletedAt: null,
          status: 'COMPLETED',
        },
      }),
      prisma.client.count({
        where: {
          ...whereFirm,
          deletedAt: null,
        },
      }),
      prisma.user.count({
        where: {
          ...whereFirm,
          deletedAt: null,
          role: { in: ['USER', 'EMPLOYEE', 'FIRM_ADMIN'] },
        },
      }),
      prisma.invoice.findMany({
        where: {
          ...whereFirm,
          deletedAt: null,
        },
        select: {
          totalAmount: true,
          status: true,
        },
      }),
      prisma.invoice.aggregate({
        where: {
          ...whereFirm,
          deletedAt: null,
          status: { in: ['UNPAID', 'OVERDUE', 'PARTIAL'] },
        },
        _sum: {
          totalAmount: true,
        },
      }),
      prisma.complianceItem.count({
        where: {
          ...whereFirm,
          deletedAt: null,
        },
      }),
      prisma.complianceItem.count({
        where: {
          ...whereFirm,
          deletedAt: null,
          status: 'OVERDUE',
        },
      }),
    ]);

    const totalBilled = totalInvoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);
    const paidBilled = totalInvoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);
    const outstandingAmount = Number(unpaidInvoices._sum.totalAmount) || 0;

    return {
      totalPendingTasks,
      totalCompletedTasks,
      totalClients,
      totalEmployees,
      totalBilled,
      paidBilled,
      outstandingAmount,
      totalComplianceItems,
      overdueComplianceItems,
    };
  }

  /**
   * 1. Pending Tasks Report
   */
  async getPendingTasks(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, employeeId, clientId, priority, search } = queryParams;
    const where = {
      deletedAt: null,
      status: { in: ['PENDING', 'IN_PROGRESS', 'OVERDUE', 'REOPENED'] },
    };

    if (firmId) where.firmId = Number(firmId);
    if (priority) where.priority = priority;

    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.createdAt = dateFilter;

    if (clientId) where.clientId = Number(clientId);
    if (employeeId) {
      where.assignees = {
        some: { userId: Number(employeeId) },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { taskCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        assignees: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
      },
      orderBy: { dueDate: 'asc' },
    });

    const now = new Date();
    return tasks.map((t) => {
      const isOverdue = t.dueDate && new Date(t.dueDate) < now;
      const delayDays = isOverdue
        ? Math.floor((now.getTime() - new Date(t.dueDate).getTime()) / (1000 * 3600 * 24))
        : 0;

      return {
        taskId: t.id,
        taskCode: t.taskCode || `TSK-${t.id}`,
        title: t.title,
        status: isOverdue ? 'OVERDUE' : t.status,
        priority: t.priority,
        clientName: t.client?.clientName || t.client?.companyName || 'N/A',
        assignees: t.assignees.map((a) => `${a.user.firstName} ${a.user.lastName}`).join(', ') || 'Unassigned',
        dueDate: t.dueDate,
        createdAt: t.createdAt,
        delayDays,
      };
    });
  }

  /**
   * 2. Completed Tasks Report
   */
  async getCompletedTasks(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, employeeId, clientId, search } = queryParams;
    const where = {
      deletedAt: null,
      status: 'COMPLETED',
    };

    if (firmId) where.firmId = Number(firmId);

    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.updatedAt = dateFilter;

    if (clientId) where.clientId = Number(clientId);
    if (employeeId) {
      where.assignees = {
        some: { userId: Number(employeeId) },
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { taskCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tasks = await prisma.task.findMany({
      where,
      include: {
        client: { select: { id: true, clientName: true, companyName: true } },
        assignees: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true, email: true } },
          },
        },
        timeEntries: { select: { durationMinutes: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return tasks.map((t) => {
      const totalMinutes = t.timeEntries.reduce((acc, te) => acc + (te.durationMinutes || 0), 0);
      const hoursSpent = (totalMinutes / 60).toFixed(1);

      return {
        taskId: t.id,
        taskCode: t.taskCode || `TSK-${t.id}`,
        title: t.title,
        priority: t.priority,
        clientName: t.client?.clientName || t.client?.companyName || 'N/A',
        assignees: t.assignees.map((a) => `${a.user.firstName} ${a.user.lastName}`).join(', ') || 'N/A',
        completedAt: t.updatedAt,
        hoursSpent: Number(hoursSpent),
      };
    });
  }

  /**
   * 3. Employee Performance Report
   */
  async getEmployeePerformance(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, employeeId, search } = queryParams;
    const whereUser = {
      deletedAt: null,
    };
    if (firmId) whereUser.firmId = Number(firmId);
    if (employeeId) whereUser.id = Number(employeeId);
    if (search) {
      whereUser.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereUser,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        designation: true,
        taskAssignees: {
          select: {
            task: {
              select: {
                id: true,
                status: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
                firmId: true,
              },
            },
          },
        },
        timeEntries: {
          select: {
            durationMinutes: true,
            isBillable: true,
            createdAt: true,
          },
        },
      },
    });

    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);

    return users.map((u) => {
      let userTasks = u.taskAssignees
        .map((ta) => ta.task)
        .filter((t) => t && !t.deletedAt && (!firmId || t.firmId === Number(firmId)));

      if (dateFilter) {
        userTasks = userTasks.filter((t) => {
          const dt = new Date(t.createdAt);
          if (dateFilter.gte && dt < dateFilter.gte) return false;
          if (dateFilter.lte && dt > dateFilter.lte) return false;
          return true;
        });
      }

      const totalAssigned = userTasks.length;
      const completedCount = userTasks.filter((t) => t.status === 'COMPLETED').length;
      const pendingCount = totalAssigned - completedCount;
      const completionRate = totalAssigned > 0 ? ((completedCount / totalAssigned) * 100).toFixed(1) : '0.0';

      let userTimeEntries = u.timeEntries;
      if (dateFilter) {
        userTimeEntries = userTimeEntries.filter((te) => {
          const dt = new Date(te.createdAt);
          if (dateFilter.gte && dt < dateFilter.gte) return false;
          if (dateFilter.lte && dt > dateFilter.lte) return false;
          return true;
        });
      }

      const totalMinutes = userTimeEntries.reduce((acc, te) => acc + (te.durationMinutes || 0), 0);
      const billableMinutes = userTimeEntries
        .filter((te) => te.isBillable)
        .reduce((acc, te) => acc + (te.durationMinutes || 0), 0);

      return {
        employeeId: u.id,
        name: `${u.firstName} ${u.lastName}`,
        email: u.email,
        designation: u.designation || 'Staff Member',
        totalAssigned,
        completedCount,
        pendingCount,
        completionRate: Number(completionRate),
        loggedHours: Number((totalMinutes / 60).toFixed(1)),
        billableHours: Number((billableMinutes / 60).toFixed(1)),
      };
    });
  }

  /**
   * 4. Client Report
   */
  async getClientReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, clientId, search } = queryParams;
    const where = { deletedAt: null };
    if (firmId) where.firmId = Number(firmId);
    if (clientId) where.id = Number(clientId);
    if (search) {
      where.OR = [
        { clientName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      select: {
        id: true,
        clientName: true,
        companyName: true,
        email: true,
        phone: true,
        clientType: true,
        status: true,
        createdAt: true,
        clientAssignments: {
          select: { id: true },
        },
      },
    });

    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);

    // Collect tasks and invoices per client
    const clientReports = await Promise.all(
      clients.map(async (c) => {
        const taskWhere = { clientId: c.id, deletedAt: null };
        if (dateFilter) taskWhere.createdAt = dateFilter;

        const invoiceWhere = { clientId: c.id, deletedAt: null };
        if (dateFilter) invoiceWhere.issueDate = dateFilter;

        const [tasks, invoices] = await Promise.all([
          prisma.task.findMany({
            where: taskWhere,
            select: { status: true },
          }),
          prisma.invoice.findMany({
            where: invoiceWhere,
            select: { totalAmount: true, status: true },
          }),
        ]);

        const totalTasks = tasks.length;
        const activeTasks = tasks.filter((t) => t.status !== 'COMPLETED').length;
        const completedTasks = totalTasks - activeTasks;

        const totalBilled = invoices.reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);
        const outstanding = invoices
          .filter((inv) => ['UNPAID', 'OVERDUE', 'PARTIAL'].includes(inv.status))
          .reduce((acc, inv) => acc + (Number(inv.totalAmount) || 0), 0);

        return {
          clientId: c.id,
          clientName: c.clientName,
          companyName: c.companyName || 'N/A',
          email: c.email,
          phone: c.phone || 'N/A',
          clientType: c.clientType,
          status: c.status,
          assignedStaffCount: c.clientAssignments.length,
          totalTasks,
          activeTasks,
          completedTasks,
          totalBilled: Number(totalBilled.toFixed(2)),
          outstandingBalance: Number(outstanding.toFixed(2)),
          createdAt: c.createdAt,
        };
      })
    );

    return clientReports;
  }

  /**
   * 5. Billing Report
   */
  async getBillingReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, status, clientId, search } = queryParams;
    const where = { deletedAt: null };

    if (firmId) where.firmId = Number(firmId);
    if (status) where.status = status;
    if (clientId) where.clientId = Number(clientId);

    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.issueDate = dateFilter;

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true } },
        items: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    return invoices.map((inv) => {
      const subtotal = Number(inv.subtotal || inv.totalAmount || 0);
      const taxAmount = Number(inv.taxAmount || 0);
      const totalAmount = Number(inv.totalAmount || 0);

      return {
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber || `INV-${inv.id}`,
        clientName: inv.client?.clientName || inv.client?.companyName || 'N/A',
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        status: inv.status,
        subtotal,
        taxAmount,
        totalAmount,
        notes: inv.notes || '',
      };
    });
  }

  /**
   * 6. Revenue Report
   */
  async getRevenueReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd } = queryParams;
    const where = { deletedAt: null };

    if (firmId) where.firmId = Number(firmId);
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);

    // Retrieve payments and paid invoices
    const [payments, paidInvoices] = await Promise.all([
      prisma.paymentRecord.findMany({
        where: {
          invoice: where,
          ...(dateFilter ? { paymentDate: dateFilter } : {}),
        },
        include: {
          invoice: {
            include: {
              client: { select: { clientName: true, companyName: true } },
            },
          },
        },
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.invoice.findMany({
        where: {
          ...where,
          status: 'PAID',
          ...(dateFilter ? { updatedAt: dateFilter } : {}),
        },
        include: {
          client: { select: { clientName: true, companyName: true } },
        },
      }),
    ]);

    const revenueByMonth = {};
    const revenueByPaymentMode = {};
    let totalRevenue = 0;

    payments.forEach((p) => {
      const amount = Number(p.amount) || 0;
      totalRevenue += amount;

      const dateObj = new Date(p.paymentDate);
      const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
      revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + amount;

      const mode = p.paymentMode || 'OTHER';
      revenueByPaymentMode[mode] = (revenueByPaymentMode[mode] || 0) + amount;
    });

    // If payment records empty, fallback to paid invoices
    if (payments.length === 0 && paidInvoices.length > 0) {
      paidInvoices.forEach((inv) => {
        const amount = Number(inv.totalAmount) || 0;
        totalRevenue += amount;

        const dateObj = new Date(inv.updatedAt);
        const monthKey = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
        revenueByMonth[monthKey] = (revenueByMonth[monthKey] || 0) + amount;
        revenueByPaymentMode['BANK_TRANSFER'] = (revenueByPaymentMode['BANK_TRANSFER'] || 0) + amount;
      });
    }

    const monthlyTrends = Object.keys(revenueByMonth)
      .sort()
      .map((month) => ({
        month,
        revenue: Number(revenueByMonth[month].toFixed(2)),
      }));

    const paymentModeBreakdown = Object.keys(revenueByPaymentMode).map((mode) => ({
      mode,
      amount: Number(revenueByPaymentMode[mode].toFixed(2)),
    }));

    const recentTransactions = payments.map((p) => ({
      paymentId: p.id,
      invoiceNumber: p.invoice?.invoiceNumber || `INV-${p.invoiceId}`,
      clientName: p.invoice?.client?.clientName || p.invoice?.client?.companyName || 'N/A',
      amount: Number(p.amount),
      paymentMode: p.paymentMode,
      referenceNumber: p.referenceNumber || 'N/A',
      paymentDate: p.paymentDate,
    }));

    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      monthlyTrends,
      paymentModeBreakdown,
      recentTransactions,
    };
  }

  /**
   * 7. Outstanding Payments Report
   */
  async getOutstandingPayments(firmId, queryParams = {}) {
    const { clientId, search } = queryParams;
    const where = {
      deletedAt: null,
      status: { in: ['UNPAID', 'OVERDUE', 'PARTIAL'] },
    };

    if (firmId) where.firmId = Number(firmId);
    if (clientId) where.clientId = Number(clientId);

    if (search) {
      where.OR = [
        { invoiceNumber: { contains: search, mode: 'insensitive' } },
        { client: { clientName: { contains: search, mode: 'insensitive' } } },
        { client: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where,
      include: {
        client: { select: { id: true, clientName: true, companyName: true, email: true, phone: true } },
        payments: { select: { amount: true } },
      },
      orderBy: { dueDate: 'asc' },
    });

    const now = new Date();
    return invoices.map((inv) => {
      const paidTotal = inv.payments.reduce((acc, p) => acc + (Number(p.amount) || 0), 0);
      const totalAmount = Number(inv.totalAmount) || 0;
      const outstandingAmount = Math.max(0, totalAmount - paidTotal);

      const dueDateObj = new Date(inv.dueDate);
      const isOverdue = dueDateObj < now;
      const overdueDays = isOverdue
        ? Math.floor((now.getTime() - dueDateObj.getTime()) / (1000 * 3600 * 24))
        : 0;

      return {
        invoiceId: inv.id,
        invoiceNumber: inv.invoiceNumber || `INV-${inv.id}`,
        clientName: inv.client?.clientName || inv.client?.companyName || 'N/A',
        email: inv.client?.email || 'N/A',
        phone: inv.client?.phone || 'N/A',
        issueDate: inv.issueDate,
        dueDate: inv.dueDate,
        totalAmount,
        paidAmount: Number(paidTotal.toFixed(2)),
        outstandingAmount: Number(outstandingAmount.toFixed(2)),
        status: isOverdue ? 'OVERDUE' : inv.status,
        overdueDays,
      };
    });
  }

  /**
   * 8. Compliance Report
   */
  async getComplianceReport(firmId, queryParams = {}) {
    const { dateRange, customStart, customEnd, status, category, riskLevel, search } = queryParams;
    const where = { deletedAt: null };

    if (firmId) where.firmId = Number(firmId);
    if (status) where.status = status;
    if (category) where.category = category;
    if (riskLevel) where.riskLevel = riskLevel;

    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);
    if (dateFilter) where.dueDate = dateFilter;

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const items = await prisma.complianceItem.findMany({
      where,
      orderBy: { dueDate: 'asc' },
    });

    const now = new Date();
    return items.map((ci) => {
      const isOverdue = ci.status !== 'COMPLETED' && new Date(ci.dueDate) < now;
      return {
        complianceId: ci.id,
        title: ci.title,
        category: ci.category,
        dueDate: ci.dueDate,
        riskLevel: ci.riskLevel || 'MEDIUM',
        status: isOverdue ? 'OVERDUE' : ci.status,
        description: ci.description || '',
        penaltyNotes: ci.penaltyNotes || '',
      };
    });
  }

  /**
   * 9. Custom Report Builder
   */
  async generateCustomReport(firmId, config = {}) {
    const { entity = 'tasks', selectedFields = [], dateRange, customStart, customEnd, status } = config;
    const dateFilter = this._getDateRangeFilter(dateRange, customStart, customEnd);

    if (entity === 'tasks') {
      const where = { deletedAt: null };
      if (firmId) where.firmId = Number(firmId);
      if (status) where.status = status;
      if (dateFilter) where.createdAt = dateFilter;

      const tasks = await prisma.task.findMany({
        where,
        include: {
          client: { select: { clientName: true, companyName: true } },
          assignees: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
        take: 100,
        orderBy: { createdAt: 'desc' },
      });

      return tasks.map((t) => {
        const row = {};
        if (selectedFields.includes('id') || selectedFields.length === 0) row.ID = t.id;
        if (selectedFields.includes('taskCode') || selectedFields.length === 0) row['Task Code'] = t.taskCode || `TSK-${t.id}`;
        if (selectedFields.includes('title') || selectedFields.length === 0) row.Title = t.title;
        if (selectedFields.includes('status') || selectedFields.length === 0) row.Status = t.status;
        if (selectedFields.includes('priority') || selectedFields.length === 0) row.Priority = t.priority;
        if (selectedFields.includes('clientName') || selectedFields.length === 0) row.Client = t.client?.clientName || t.client?.companyName || 'N/A';
        if (selectedFields.includes('assignees') || selectedFields.length === 0) row.Assignees = t.assignees.map((a) => `${a.user.firstName} ${a.user.lastName}`).join(', ') || 'N/A';
        if (selectedFields.includes('dueDate') || selectedFields.length === 0) row['Due Date'] = t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'N/A';
        if (selectedFields.includes('createdAt') || selectedFields.length === 0) row['Created At'] = new Date(t.createdAt).toLocaleDateString();
        return row;
      });
    }

    if (entity === 'clients') {
      const where = { deletedAt: null };
      if (firmId) where.firmId = Number(firmId);
      if (status) where.status = status;
      if (dateFilter) where.createdAt = dateFilter;

      const clients = await prisma.client.findMany({
        where,
        take: 100,
        orderBy: { createdAt: 'desc' },
      });

      return clients.map((c) => {
        const row = {};
        if (selectedFields.includes('id') || selectedFields.length === 0) row.ID = c.id;
        if (selectedFields.includes('clientName') || selectedFields.length === 0) row['Client Name'] = c.clientName;
        if (selectedFields.includes('companyName') || selectedFields.length === 0) row['Company Name'] = c.companyName || 'N/A';
        if (selectedFields.includes('email') || selectedFields.length === 0) row.Email = c.email;
        if (selectedFields.includes('phone') || selectedFields.length === 0) row.Phone = c.phone || 'N/A';
        if (selectedFields.includes('clientType') || selectedFields.length === 0) row.Type = c.clientType;
        if (selectedFields.includes('status') || selectedFields.length === 0) row.Status = c.status;
        if (selectedFields.includes('createdAt') || selectedFields.length === 0) row['Created At'] = new Date(c.createdAt).toLocaleDateString();
        return row;
      });
    }

    if (entity === 'invoices') {
      const where = { deletedAt: null };
      if (firmId) where.firmId = Number(firmId);
      if (status) where.status = status;
      if (dateFilter) where.issueDate = dateFilter;

      const invoices = await prisma.invoice.findMany({
        where,
        include: { client: { select: { clientName: true, companyName: true } } },
        take: 100,
        orderBy: { issueDate: 'desc' },
      });

      return invoices.map((inv) => {
        const row = {};
        if (selectedFields.includes('id') || selectedFields.length === 0) row.ID = inv.id;
        if (selectedFields.includes('invoiceNumber') || selectedFields.length === 0) row['Invoice #'] = inv.invoiceNumber || `INV-${inv.id}`;
        if (selectedFields.includes('clientName') || selectedFields.length === 0) row.Client = inv.client?.clientName || inv.client?.companyName || 'N/A';
        if (selectedFields.includes('issueDate') || selectedFields.length === 0) row['Issue Date'] = new Date(inv.issueDate).toLocaleDateString();
        if (selectedFields.includes('dueDate') || selectedFields.length === 0) row['Due Date'] = new Date(inv.dueDate).toLocaleDateString();
        if (selectedFields.includes('status') || selectedFields.length === 0) row.Status = inv.status;
        if (selectedFields.includes('totalAmount') || selectedFields.length === 0) row['Total Amount'] = Number(inv.totalAmount);
        return row;
      });
    }

    if (entity === 'employees') {
      const where = { deletedAt: null };
      if (firmId) where.firmId = Number(firmId);
      if (dateFilter) where.createdAt = dateFilter;

      const users = await prisma.user.findMany({
        where,
        take: 100,
        orderBy: { createdAt: 'desc' },
      });

      return users.map((u) => {
        const row = {};
        if (selectedFields.includes('id') || selectedFields.length === 0) row.ID = u.id;
        if (selectedFields.includes('name') || selectedFields.length === 0) row.Name = `${u.firstName} ${u.lastName}`;
        if (selectedFields.includes('email') || selectedFields.length === 0) row.Email = u.email;
        if (selectedFields.includes('designation') || selectedFields.length === 0) row.Designation = u.designation || 'Staff';
        if (selectedFields.includes('role') || selectedFields.length === 0) row.Role = u.role;
        if (selectedFields.includes('status') || selectedFields.length === 0) row.Status = u.status;
        if (selectedFields.includes('createdAt') || selectedFields.length === 0) row['Joined At'] = new Date(u.createdAt).toLocaleDateString();
        return row;
      });
    }

    return [];
  }
}

module.exports = new ReportRepository();
