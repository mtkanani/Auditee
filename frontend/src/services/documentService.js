import axiosInstance from './axiosInstance';

export const documentService = {
  // Upload a document to the vault
  uploadDocument: (data) => axiosInstance.post('/documents/upload', data),

  // Firm Admin - get all firm documents
  getFirmVault: (params = {}) => axiosInstance.get('/documents/firm', { params }),

  // Client - get client documents
  getClientVault: (params = {}) => axiosInstance.get('/documents/client', { params }),

  // Employee - get user documents
  getUserVault: (params = {}) => axiosInstance.get('/documents/user', { params }),

  // Delete a document (soft delete)
  deleteDocument: (id) => axiosInstance.delete(`/documents/${id}`),
};
