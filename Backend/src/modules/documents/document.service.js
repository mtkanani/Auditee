const documentRepository = require('./document.repository');
const storage = require('../../utils/storage');
const { AppError, BadRequestError, ForbiddenError, NotFoundError } = require('../../utils/errors');

const isAdmin = (user) => ['FIRM_ADMIN', 'ADMIN'].includes((user.role || '').toUpperCase());

// Rows saved before real uploads existed point at this made-up bucket; there is no file behind them.
const PLACEHOLDER_URL_PREFIX = 'https://auditee-vault.s3.amazonaws.com/';

/** Same rules as the vault lists: admins see all, staff skip others' confidential files, clients see their own. */
const canRead = (doc, user) => {
  if (isAdmin(user)) return true;
  if (user.isClient) return doc.clientId === user.clientId && !doc.isConfidential;
  return !doc.isConfidential || doc.uploadedBy === user.id;
};

/** Admins delete anything in the firm; everyone else only what they uploaded themselves. */
const canDelete = (doc, user) => {
  if (isAdmin(user)) return true;
  if (user.isClient) return doc.uploadedByClientId === user.clientId;
  return doc.uploadedBy === user.id;
};

class DocumentService {
  /** Step 1 of an upload: check the file and hand back a short-lived URL to PUT it to. */
  async createUploadUrl({ fileName, fileSize, area = 'vault' }, user) {
    // Client master documents are firm-only; tasks and the vault are open to every role.
    if (area === 'clients' && !isAdmin(user)) {
      throw new ForbiddenError('Only the firm can upload client records.');
    }
    const contentType = storage.contentTypeFor(fileName);
    if (!contentType) {
      throw new BadRequestError(`This file type is not allowed. Use ${storage.ALLOWED_EXTENSIONS.join(', ')}.`);
    }
    if (Number(fileSize) > storage.MAX_FILE_BYTES) {
      throw new BadRequestError('Files can be at most 25 MB.');
    }

    const storageKey = storage.buildKey(user.firmId, area, fileName);
    const uploadUrl = await storage.presignUpload(storageKey, contentType);
    return { storageKey, uploadUrl, contentType, expiresIn: storage.UPLOAD_URL_TTL_SECONDS };
  }

  /** Step 2: save the document row. For stored files, confirm the object really exists first. */
  async uploadDocument(data, user) {
    const firmId = user.firmId;
    let { fileSize, mimeType } = data;

    if (data.storageKey) {
      const object = await storage.verifyUpload(data.storageKey, firmId, 'vault');
      fileSize = object.size;
      mimeType = object.contentType;
    } else if (!data.fileUrl) {
      throw new BadRequestError('Upload a file or give a file link.');
    }

    // Clients can only file documents against themselves.
    const clientId = user.isClient ? user.clientId : data.clientId ? parseInt(data.clientId, 10) : null;

    return await documentRepository.createDocument({
      firmId,
      clientId,
      taskId: data.taskId ? parseInt(data.taskId, 10) : null,
      uploadedBy: user.isClient ? null : user.id,
      uploadedByClientId: user.isClient ? user.clientId : null,
      title: data.title.trim(),
      fileName: data.fileName.trim(),
      fileUrl: data.storageKey ? null : data.fileUrl.trim(),
      storageKey: data.storageKey || null,
      fileSize: fileSize ? parseInt(fileSize, 10) : 1024,
      mimeType: mimeType || 'application/pdf',
      category: data.category || 'GENERAL',
      isConfidential: user.isClient ? false : Boolean(data.isConfidential),
      notes: data.notes ? data.notes.trim() : null,
    });
  }

  /** Short-lived link to the file, after the same access check as the lists. */
  async getDownloadUrl(id, user) {
    const doc = await documentRepository.findDocumentById(id, user.firmId);
    if (!doc || !canRead(doc, user)) {
      throw new NotFoundError('Document not found in vault');
    }

    if (doc.storageKey) {
      const url = await storage.presignDownload(doc.storageKey, doc.fileName);
      return { url, expiresIn: storage.DOWNLOAD_URL_TTL_SECONDS };
    }
    if (doc.fileUrl && !doc.fileUrl.startsWith(PLACEHOLDER_URL_PREFIX)) {
      return { url: doc.fileUrl, external: true };
    }
    throw new AppError('This file was never uploaded. Please upload it again.', 410);
  }

  async getFirmVaultDocuments(firmId, queryParams) {
    return await documentRepository.findFirmDocuments({
      firmId,
      category: queryParams.category,
      search: queryParams.search,
      page: queryParams.page,
      limit: queryParams.limit,
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
      page: queryParams.page,
      limit: queryParams.limit,
    });
  }

  async getUserVaultDocuments(firmId, userId, queryParams) {
    return await documentRepository.findUserDocuments({
      firmId,
      userId,
      category: queryParams.category,
      search: queryParams.search,
      page: queryParams.page,
      limit: queryParams.limit,
    });
  }

  async deleteDocument(id, user) {
    const doc = await documentRepository.findDocumentById(id, user.firmId);
    if (!doc || !canRead(doc, user)) {
      throw new NotFoundError('Document not found in vault');
    }
    if (!canDelete(doc, user)) {
      throw new ForbiddenError('You can only delete documents you uploaded.');
    }
    // Soft delete: the stored file is kept so the record can be restored or audited.
    return await documentRepository.softDeleteDocument(id, user.firmId);
  }
}

module.exports = new DocumentService();
