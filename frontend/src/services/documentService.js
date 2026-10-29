import axios from 'axios';
import axiosInstance from './axiosInstance';

export const documentService = {
  // Step 1 of an upload: ask the API for a short-lived URL to PUT the file to
  // area: 'vault' (default), 'tasks' or 'clients' (firm admin only)
  getUploadUrl: ({ fileName, fileSize, area }) => axiosInstance.post('/documents/upload-url', { fileName, fileSize, area }),

  // Step 2: send the file straight to storage. Plain axios on purpose: the signed URL is the
  // credential, and our Authorization header would make R2 reject the request.
  putFile: (uploadUrl, file, contentType, onProgress) =>
    axios.put(uploadUrl, file, {
      headers: { 'Content-Type': contentType },
      onUploadProgress: (e) => onProgress?.(e.total ? Math.round((e.loaded / e.total) * 100) : 0),
    }),

  // Step 3: save the document to the vault
  uploadDocument: (data) => axiosInstance.post('/documents/upload', data),

  // Short-lived download link, after the API's access check
  getDownloadUrl: (id) => axiosInstance.get(`/documents/${id}/download`),

  // Firm Admin - get all firm documents
  getFirmVault: (params = {}) => axiosInstance.get('/documents/firm', { params }),

  // Client - get client documents
  getClientVault: (params = {}) => axiosInstance.get('/documents/client', { params }),

  // Employee - get user documents
  getUserVault: (params = {}) => axiosInstance.get('/documents/user', { params }),

  // Delete a document (soft delete)
  deleteDocument: (id) => axiosInstance.delete(`/documents/${id}`),
};

/** Steps 1 and 2 in one: sign, then PUT the file to storage. Returns the storage key to save. */
export const storeFile = async (file, area, onProgress) => {
  const { data: signed } = await documentService.getUploadUrl({ fileName: file.name, fileSize: file.size, area });
  const { storageKey, uploadUrl, contentType } = signed.data;
  await documentService.putFile(uploadUrl, file, contentType, onProgress);
  return { storageKey, contentType };
};
