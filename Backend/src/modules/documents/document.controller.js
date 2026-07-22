const documentService = require('./document.service');

class DocumentController {
  async uploadDocument(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const userId = req.user.id;
      const doc = await documentService.uploadDocument(req.body, userId, firmId);
      return res.status(201).json({
        success: true,
        message: 'Document uploaded to Document Vault successfully',
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  async getFirmVault(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const docs = await documentService.getFirmVaultDocuments(firmId, req.query);
      return res.status(200).json({
        success: true,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientVault(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = req.user.clientId || req.user.id;
      const docs = await documentService.getClientVaultDocuments(clientId, firmId, req.query);
      return res.status(200).json({
        success: true,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserVault(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const docs = await documentService.getUserVaultDocuments(firmId, req.query);
      return res.status(200).json({
        success: true,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const id = parseInt(req.params.id, 10);
      await documentService.deleteDocument(id, firmId);
      return res.status(200).json({
        success: true,
        message: 'Document removed from vault',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DocumentController();
