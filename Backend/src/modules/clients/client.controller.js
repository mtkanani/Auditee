const clientService = require('./client.service');
const { CLIENT_MESSAGES } = require('./client.constants');

class ClientController {
  async createClient(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const createdBy = req.user.id;
      const client = await clientService.createClient(req.body, firmId, createdBy);
      return res.status(201).json({
        success: true,
        message: CLIENT_MESSAGES.CREATED,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllClients(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const result = await clientService.getAllClients(req.query, firmId);
      return res.status(200).json({
        success: true,
        message: CLIENT_MESSAGES.FETCHED_ALL,
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientById(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const client = await clientService.getClientById(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: CLIENT_MESSAGES.FETCHED_DETAILS,
        data: client,
      });
    } catch (error) {
      next(error);
    }
  }

  async updateClient(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const updatedClient = await clientService.updateClient(clientId, req.body, firmId);
      return res.status(200).json({
        success: true,
        message: CLIENT_MESSAGES.UPDATED,
        data: updatedClient,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteClient(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const result = await clientService.deleteClient(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async changeClientStatus(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const { status } = req.body;
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const updatedClient = await clientService.changeClientStatus(clientId, status, firmId, performedBy, performedName);
      return res.status(200).json({
        success: true,
        message: CLIENT_MESSAGES.STATUS_UPDATED,
        data: updatedClient,
      });
    } catch (error) {
      next(error);
    }
  }

  async addService(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const service = await clientService.addService(clientId, req.body, firmId, performedBy, performedName);
      return res.status(201).json({
        success: true,
        message: 'Client service added successfully',
        data: service,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeService(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const serviceId = parseInt(req.params.serviceId, 10);
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const result = await clientService.removeService(clientId, serviceId, firmId, performedBy, performedName);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async addDocument(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const document = await clientService.addDocument(clientId, req.body, firmId, performedBy, performedName);
      return res.status(201).json({
        success: true,
        message: 'Client master document added successfully',
        data: document,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const documentId = parseInt(req.params.documentId, 10);
      const performedBy = req.user.id;
      const performedName = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || 'Firm Admin';
      const result = await clientService.deleteDocument(clientId, documentId, firmId, performedBy, performedName);
      return res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientHistory(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = parseInt(req.params.clientId, 10);
      const history = await clientService.getClientHistory(clientId, firmId);
      return res.status(200).json({
        success: true,
        message: 'Client activity history fetched successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ClientController();
