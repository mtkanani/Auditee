const documentRepository = require('./document.repository');
const { BadRequestError, NotFoundError } = require('../../utils/errors');

class DocumentService {
  async uploadDocument(data, userId, firmId) {
    return await documentRepository.createDocument({
      firmId,
      clientId: data.clientId ? parseInt(data.clientId, 10) : null,
      taskId: data.taskId ? parseInt(data.taskId, 10) : null,
      uploadedBy: userId,
      title: data.title.trim(),
      fileName: data.fileName.trim(),
      fileUrl: data.fileUrl.trim(),
      fileSize: data.fileSize ? parseInt(data.fileSize, 10) : 1024,
      mimeType: data.mimeType || 'application/pdf',
      category: data.category || 'GENERAL',
      isConfidential: Boolean(data.isConfidential),
      notes: data.notes ? data.notes.trim() : null,
    });
  }

  async getFirmVaultDocuments(firmId, queryParams) {
    return await documentRepository.findFirmDocuments({
      firmId,
      category: queryParams.category,
      search: queryParams.search,
      clientId: queryParams.clientId,
      taskId: queryParams.taskId,
    });
  }

  async getClientVaultDocuments(clientId, firmId, queryParams) {
    return await documentRepository.findClientDocuments({
      clientId,
      firmId,
      category: queryParams.category,
      search: queryParams.search,
    });
  }

  async getUserVaultDocuments(firmId, queryParams) {
    return await documentRepository.findUserDocuments({
      firmId,
      category: queryParams.category,
      search: queryParams.search,
    });
  }

  async deleteDocument(id, firmId) {
    const doc = await documentRepository.findDocumentById(id, firmId);
    if (!doc) {
      throw new NotFoundError('Document not found in vault');
    }
    return await documentRepository.softDeleteDocument(id, firmId);
  }
}

module.exports = new DocumentService();
