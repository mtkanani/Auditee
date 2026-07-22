const bcrypt = require('bcryptjs');
const clientRepository = require('./client.repository');
const { CLIENT_MESSAGES } = require('./client.constants');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

class ClientService {
  async createClient(clientData, firmId, createdBy, performedName = 'Firm Admin') {
    const existing = await clientRepository.findByEmail(clientData.email.toLowerCase().trim());
    if (existing) {
      throw new BadRequestError(CLIENT_MESSAGES.EMAIL_EXISTS);
    }

    let hashedPassword = null;
    if (clientData.password) {
      hashedPassword = await bcrypt.hash(clientData.password, 10);
    }

    const newClient = await clientRepository.create({
      firmId,
      clientName: clientData.clientName.trim(),
      clientType: clientData.clientType || 'INDIVIDUAL',
      companyName: clientData.companyName ? clientData.companyName.trim() : null,
      email: clientData.email.toLowerCase().trim(),
      password: hashedPassword,
      phone: clientData.phone ? clientData.phone.trim() : null,
      alternatePhone: clientData.alternatePhone ? clientData.alternatePhone.trim() : null,
      gstNumber: clientData.gstNumber ? clientData.gstNumber.trim().toUpperCase() : null,
      panNumber: clientData.panNumber ? clientData.panNumber.trim().toUpperCase() : null,
      tanNumber: clientData.tanNumber ? clientData.tanNumber.trim().toUpperCase() : null,
      cinNumber: clientData.cinNumber ? clientData.cinNumber.trim().toUpperCase() : null,
      businessType: clientData.businessType ? clientData.businessType.trim() : null,
      industryCategory: clientData.industryCategory ? clientData.industryCategory.trim() : null,
      website: clientData.website ? clientData.website.trim() : null,
      contactPersonName: clientData.contactPersonName ? clientData.contactPersonName.trim() : null,
      contactPersonDesignation: clientData.contactPersonDesignation ? clientData.contactPersonDesignation.trim() : null,
      contactPersonEmail: clientData.contactPersonEmail ? clientData.contactPersonEmail.trim().toLowerCase() : null,
      contactPersonPhone: clientData.contactPersonPhone ? clientData.contactPersonPhone.trim() : null,
      address: clientData.address ? clientData.address.trim() : null,
      city: clientData.city ? clientData.city.trim() : null,
      state: clientData.state ? clientData.state.trim() : null,
      country: clientData.country ? clientData.country.trim() : null,
      pincode: clientData.pincode ? clientData.pincode.trim() : null,
      billingAddress: clientData.billingAddress ? clientData.billingAddress.trim() : null,
      paymentTerms: clientData.paymentTerms || 'NET_30',
      taxRegistrationType: clientData.taxRegistrationType || 'REGULAR',
      outstandingBalance: clientData.outstandingBalance ? parseFloat(clientData.outstandingBalance) : 0.0,
      billingNotes: clientData.billingNotes ? clientData.billingNotes.trim() : null,
      status: clientData.status || 'ACTIVE',
      createdBy,
    });

    // Log Client Created Activity
    await clientRepository.logActivity(newClient.id, {
      action: 'CLIENT_CREATED',
      description: `Client profile '${newClient.clientName}' created successfully.`,
      performedBy: createdBy,
      performedName,
    });

    const { password, ...clientResponse } = newClient;
    return clientResponse;
  }

  async getAllClients(queryParams, firmId) {
    return await clientRepository.findAll({ ...queryParams, firmId });
  }

  async getClientById(clientId, firmId) {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }
    const { password, ...clientResponse } = client;
    return clientResponse;
  }

  async updateClient(clientId, updateData, firmId, performedBy, performedName = 'Firm Admin') {
    const existing = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!existing) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }

    if (updateData.email && updateData.email.toLowerCase().trim() !== existing.email) {
      const emailTaken = await clientRepository.findByEmail(updateData.email.toLowerCase().trim());
      if (emailTaken) {
        throw new BadRequestError(CLIENT_MESSAGES.EMAIL_EXISTS);
      }
    }

    const payload = {};
    if (updateData.clientName) payload.clientName = updateData.clientName.trim();
    if (updateData.clientType) payload.clientType = updateData.clientType.trim();
    if (updateData.companyName !== undefined) payload.companyName = updateData.companyName ? updateData.companyName.trim() : null;
    if (updateData.email) payload.email = updateData.email.toLowerCase().trim();
    if (updateData.phone !== undefined) payload.phone = updateData.phone ? updateData.phone.trim() : null;
    if (updateData.alternatePhone !== undefined) payload.alternatePhone = updateData.alternatePhone ? updateData.alternatePhone.trim() : null;
    if (updateData.gstNumber !== undefined) payload.gstNumber = updateData.gstNumber ? updateData.gstNumber.trim().toUpperCase() : null;
    if (updateData.panNumber !== undefined) payload.panNumber = updateData.panNumber ? updateData.panNumber.trim().toUpperCase() : null;
    if (updateData.tanNumber !== undefined) payload.tanNumber = updateData.tanNumber ? updateData.tanNumber.trim().toUpperCase() : null;
    if (updateData.cinNumber !== undefined) payload.cinNumber = updateData.cinNumber ? updateData.cinNumber.trim().toUpperCase() : null;
    if (updateData.businessType !== undefined) payload.businessType = updateData.businessType ? updateData.businessType.trim() : null;
    if (updateData.industryCategory !== undefined) payload.industryCategory = updateData.industryCategory ? updateData.industryCategory.trim() : null;
    if (updateData.website !== undefined) payload.website = updateData.website ? updateData.website.trim() : null;
    if (updateData.contactPersonName !== undefined) payload.contactPersonName = updateData.contactPersonName ? updateData.contactPersonName.trim() : null;
    if (updateData.contactPersonDesignation !== undefined) payload.contactPersonDesignation = updateData.contactPersonDesignation ? updateData.contactPersonDesignation.trim() : null;
    if (updateData.contactPersonEmail !== undefined) payload.contactPersonEmail = updateData.contactPersonEmail ? updateData.contactPersonEmail.trim().toLowerCase() : null;
    if (updateData.contactPersonPhone !== undefined) payload.contactPersonPhone = updateData.contactPersonPhone ? updateData.contactPersonPhone.trim() : null;
    if (updateData.address !== undefined) payload.address = updateData.address ? updateData.address.trim() : null;
    if (updateData.city !== undefined) payload.city = updateData.city ? updateData.city.trim() : null;
    if (updateData.state !== undefined) payload.state = updateData.state ? updateData.state.trim() : null;
    if (updateData.country !== undefined) payload.country = updateData.country ? updateData.country.trim() : null;
    if (updateData.pincode !== undefined) payload.pincode = updateData.pincode ? updateData.pincode.trim() : null;
    if (updateData.billingAddress !== undefined) payload.billingAddress = updateData.billingAddress ? updateData.billingAddress.trim() : null;
    if (updateData.paymentTerms !== undefined) payload.paymentTerms = updateData.paymentTerms ? updateData.paymentTerms.trim() : null;
    if (updateData.taxRegistrationType !== undefined) payload.taxRegistrationType = updateData.taxRegistrationType ? updateData.taxRegistrationType.trim() : null;
    if (updateData.outstandingBalance !== undefined) payload.outstandingBalance = parseFloat(updateData.outstandingBalance) || 0.0;
    if (updateData.billingNotes !== undefined) payload.billingNotes = updateData.billingNotes ? updateData.billingNotes.trim() : null;

    if (updateData.password) {
      payload.password = await bcrypt.hash(updateData.password, 10);
    }

    await clientRepository.update(clientId, firmId, payload);

    await clientRepository.logActivity(clientId, {
      action: 'PROFILE_UPDATED',
      description: `Client master profile updated.`,
      performedBy,
      performedName,
    });

    return await this.getClientById(clientId, firmId);
  }

  async deleteClient(clientId, firmId, performedBy, performedName = 'Firm Admin') {
    const existing = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!existing) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }
    await clientRepository.softDelete(clientId, firmId);

    await clientRepository.logActivity(clientId, {
      action: 'CLIENT_DELETED',
      description: `Client profile deleted/archived.`,
      performedBy,
      performedName,
    });

    return { message: CLIENT_MESSAGES.DELETED };
  }

  async changeClientStatus(clientId, status, firmId, performedBy, performedName = 'Firm Admin') {
    const existing = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!existing) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }
    await clientRepository.update(clientId, firmId, { status });

    await clientRepository.logActivity(clientId, {
      action: 'STATUS_CHANGED',
      description: `Client status updated to ${status}.`,
      performedBy,
      performedName,
    });

    return await this.getClientById(clientId, firmId);
  }

  // --- Subscribed Services ---
  async addService(clientId, serviceData, firmId, performedBy, performedName = 'Firm Admin') {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }

    const service = await clientRepository.addService(clientId, serviceData);

    await clientRepository.logActivity(clientId, {
      action: 'SERVICE_ADDED',
      description: `Subscribed service '${service.serviceName}' (₹${service.feeAmount}/${service.billingFrequency}) added.`,
      performedBy,
      performedName,
    });

    return service;
  }

  async removeService(clientId, serviceId, firmId, performedBy, performedName = 'Firm Admin') {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }

    await clientRepository.removeService(serviceId, clientId);

    await clientRepository.logActivity(clientId, {
      action: 'SERVICE_REMOVED',
      description: `Client service subscription removed.`,
      performedBy,
      performedName,
    });

    return { message: 'Service removed successfully' };
  }

  // --- Master Documents ---
  async addDocument(clientId, docData, firmId, performedBy, performedName = 'Firm Admin') {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }

    const doc = await clientRepository.addDocument(clientId, {
      ...docData,
      uploadedBy: performedBy,
    });

    await clientRepository.logActivity(clientId, {
      action: 'DOCUMENT_UPLOADED',
      description: `Master document '${doc.documentName}' (${doc.documentType}) uploaded.`,
      performedBy,
      performedName,
    });

    return doc;
  }

  async deleteDocument(clientId, documentId, firmId, performedBy, performedName = 'Firm Admin') {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }

    await clientRepository.deleteDocument(documentId, clientId);

    await clientRepository.logActivity(clientId, {
      action: 'DOCUMENT_DELETED',
      description: `Master document removed.`,
      performedBy,
      performedName,
    });

    return { message: 'Document deleted successfully' };
  }

  // --- Client History Log ---
  async getClientHistory(clientId, firmId) {
    const client = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!client) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }

    return await clientRepository.getActivityLogs(clientId);
  }
}

module.exports = new ClientService();
