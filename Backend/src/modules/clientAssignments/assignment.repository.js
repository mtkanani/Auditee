const prisma = require('../../config/db');

class AssignmentRepository {
  async findAssignment(clientId, userId) {
    return await prisma.clientAssignment.findUnique({
      where: {
        clientId_userId: { clientId, userId },
      },
    });
  }

  async findById(id) {
    return await prisma.clientAssignment.findUnique({
      where: { id },
      include: {
        client: true,
        user: true,
      },
    });
  }

  async create(clientId, userId, assignedBy) {
    return await prisma.clientAssignment.create({
      data: {
        clientId,
        userId,
        assignedBy,
      },
      include: {
        client: {
          select: {
            id: true,
            clientName: true,
            companyName: true,
            email: true,
            phone: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: true,
          },
        },
      },
    });
  }

  async findAllByFirm(firmId) {
    return await prisma.clientAssignment.findMany({
      where: {
        client: { firmId, deletedAt: null },
        user: { firmId, deletedAt: null },
      },
      include: {
        client: {
          select: {
            id: true,
            clientName: true,
            companyName: true,
            email: true,
            phone: true,
            status: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: true,
            status: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async findClientsByUserId(userId, firmId) {
    return await prisma.clientAssignment.findMany({
      where: {
        userId,
        user: { firmId, deletedAt: null },
        client: { deletedAt: null },
      },
      include: {
        client: {
          select: {
            id: true,
            firmId: true,
            clientType: true,
            clientName: true,
            companyName: true,
            email: true,
            phone: true,
            gstNumber: true,
            panNumber: true,
            businessType: true,
            address: true,
            city: true,
            state: true,
            country: true,
            pincode: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async findUsersByClientId(clientId, firmId) {
    return await prisma.clientAssignment.findMany({
      where: {
        clientId,
        client: { firmId, deletedAt: null },
        user: { deletedAt: null },
      },
      include: {
        user: {
          select: {
            id: true,
            firmId: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            designation: true,
            status: true,
            profileImage: true,
            joiningDate: true,
          },
        },
      },
      orderBy: { assignedAt: 'desc' },
    });
  }

  async update(id, data) {
    return await prisma.clientAssignment.update({
      where: { id },
      data,
      include: {
        client: {
          select: {
            id: true,
            clientName: true,
            companyName: true,
            email: true,
          },
        },
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: true,
          },
        },
      },
    });
  }

  async delete(id) {
    return await prisma.clientAssignment.delete({
      where: { id },
    });
  }

  async createTask({ firmId, clientId, userId, title, description, priority, dueDate, createdBy }) {
    return await prisma.task.create({
      data: {
        firmId,
        clientId: clientId || null,
        userId: userId || null,
        title,
        description: description || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        createdByType: 'FIRM_ADMIN',
        createdBy: createdBy || null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: true,
          },
        },
        client: {
          select: {
            id: true,
            clientName: true,
            companyName: true,
            email: true,
          },
        },
      },
    });
  }

  async findTasksByFirm(firmId) {
    return await prisma.task.findMany({
      where: {
        firmId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            designation: true,
          },
        },
        client: {
          select: {
            id: true,
            clientName: true,
            companyName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

module.exports = new AssignmentRepository();
