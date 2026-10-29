const storage = require('./storage');
const { AppError, BadRequestError } = require('./errors');

/**
 * Normalises an attachment from a request body. Either storageKey (a file uploaded to R2 through
 * POST /api/documents/upload-url) or fileUrl (a pasted link) is required. Stored files are checked
 * against R2, and their real size and type replace whatever the browser sent.
 */
const resolveAttachment = async (docData, firmId, area) => {
  const storageKey = docData.storageKey ? String(docData.storageKey) : null;
  const fileUrl = docData.fileUrl ? String(docData.fileUrl).trim() : null;

  if (storageKey) {
    const object = await storage.verifyUpload(storageKey, firmId, area);
    return { storageKey, fileUrl: null, fileSize: object.size, fileType: object.contentType };
  }
  if (!fileUrl) {
    throw new BadRequestError('Upload a file or give a file link.');
  }
  return {
    storageKey: null,
    fileUrl,
    fileSize: docData.fileSize ? parseInt(docData.fileSize, 10) : null,
    fileType: docData.fileType || null,
  };
};

/** Where to download an attachment: a short-lived R2 link, or the pasted link as-is. */
const attachmentDownload = async (doc, fileName) => {
  if (doc.storageKey) {
    const url = await storage.presignDownload(doc.storageKey, fileName);
    return { url, expiresIn: storage.DOWNLOAD_URL_TTL_SECONDS };
  }
  if (doc.fileUrl) {
    return { url: doc.fileUrl, external: true };
  }
  throw new AppError('This file is no longer available.', 410);
};

module.exports = { resolveAttachment, attachmentDownload };
