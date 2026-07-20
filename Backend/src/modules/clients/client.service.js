const bcrypt = require('bcryptjs');
const clientRepository = require('./client.repository');
const { CLIENT_MESSAGES } = require('./client.constants');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

class ClientService {
  async createClient(clientData, firmId, createdBy) {
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
      gstNumber: clientData.gstNumber ? clientData.gstNumber.trim().toUpperCase() : null,
      panNumber: clientData.panNumber ? clientData.panNumber.trim().toUpperCase() : null,
      businessType: clientData.businessType ? clientData.businessType.trim() : null,
      address: clientData.address ? clientData.address.trim() : null,
      city: clientData.city ? clientData.city.trim() : null,
      state: clientData.state ? clientData.state.trim() : null,
      country: clientData.country ? clientData.country.trim() : null,
      pincode: clientData.pincode ? clientData.pincode.trim() : null,
      status: clientData.status || 'ACTIVE',
      createdBy,
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

  async updateClient(clientId, updateData, firmId) {
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
    if (updateData.gstNumber !== undefined) payload.gstNumber = updateData.gstNumber ? updateData.gstNumber.trim().toUpperCase() : null;
    if (updateData.panNumber !== undefined) payload.panNumber = updateData.panNumber ? updateData.panNumber.trim().toUpperCase() : null;
    if (updateData.businessType !== undefined) payload.businessType = updateData.businessType ? updateData.businessType.trim() : null;
    if (updateData.address !== undefined) payload.address = updateData.address ? updateData.address.trim() : null;
    if (updateData.city !== undefined) payload.city = updateData.city ? updateData.city.trim() : null;
    if (updateData.state !== undefined) payload.state = updateData.state ? updateData.state.trim() : null;
    if (updateData.country !== undefined) payload.country = updateData.country ? updateData.country.trim() : null;
    if (updateData.pincode !== undefined) payload.pincode = updateData.pincode ? updateData.pincode.trim() : null;

    if (updateData.password) {
      payload.password = await bcrypt.hash(updateData.password, 10);
    }

    await clientRepository.update(clientId, firmId, payload);
    return await this.getClientById(clientId, firmId);
  }

  async deleteClient(clientId, firmId) {
    const existing = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!existing) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }
    await clientRepository.softDelete(clientId, firmId);
    return { message: CLIENT_MESSAGES.DELETED };
  }

  async changeClientStatus(clientId, status, firmId) {
    const existing = await clientRepository.findByIdAndFirmId(clientId, firmId);
    if (!existing) {
      throw new NotFoundError(CLIENT_MESSAGES.NOT_FOUND);
    }
    await clientRepository.update(clientId, firmId, { status });
    return await this.getClientById(clientId, firmId);
  }
}

module.exports = new ClientService();
