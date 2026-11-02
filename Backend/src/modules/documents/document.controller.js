const documentService = require('./document.service');

class DocumentController {
  async createUploadUrl(req, res, next) {
    try {
      const data = await documentService.createUploadUrl(req.body, req.user);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async uploadDocument(req, res, next) {
    try {
      const doc = await documentService.uploadDocument(req.body, req.user);
      return res.status(201).json({
        success: true,
        message: 'Document uploaded to Document Vault successfully',
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  }

  async getDownloadUrl(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await documentService.getDownloadUrl(id, req.user);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async getFirmVault(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const { data, pagination, summary } = await documentService.getFirmVaultDocuments(firmId, req.query);
      return res.status(200).json({
        success: true,
        data,
        pagination,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getClientVault(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const clientId = req.user.clientId;
      const { data, pagination, summary } = await documentService.getClientVaultDocuments(clientId, firmId, req.query);
      return res.status(200).json({
        success: true,
        data,
        pagination,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserVault(req, res, next) {
    try {
      const firmId = req.user.firmId;
      const { data, pagination, summary } = await documentService.getUserVaultDocuments(firmId, req.user.id, req.query);
      return res.status(200).json({
        success: true,
        data,
        pagination,
        summary,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req, res, next) {
    try {
      const id = parseInt(req.params.id, 10);
      await documentService.deleteDocument(id, req.user);
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
