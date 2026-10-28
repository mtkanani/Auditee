const crypto = require('crypto');
const { PutObjectCommand, GetObjectCommand, HeadObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { s3, bucket, isStorageConfigured } = require('../config/storage');
const { AppError } = require('./errors');

const MAX_FILE_BYTES = 25 * 1024 * 1024;
const UPLOAD_URL_TTL_SECONDS = 5 * 60;
const DOWNLOAD_URL_TTL_SECONDS = 5 * 60;

// Extension -> the only Content-Type we sign for it.
const ALLOWED_TYPES = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  zip: 'application/zip',
};

const ensureConfigured = () => {
  if (!isStorageConfigured) {
    throw new AppError('File storage is not configured on this server yet.', 503);
  }
};

const extensionOf = (fileName = '') => (fileName.includes('.') ? fileName.split('.').pop().toLowerCase() : '');

/** Content-Type for an allowed file name, or null if the type is not allowed. */
const contentTypeFor = (fileName) => ALLOWED_TYPES[extensionOf(fileName)] || null;

/** Keep letters, digits, dot, dash and underscore so keys stay URL- and shell-safe. */
const safeName = (fileName) =>
  fileName
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+/, '')
    .slice(-120) || 'file';

/** Server-chosen object key. The prefix scopes every object to one firm. */
const buildKey = (firmId, area, fileName) => `firms/${firmId}/${area}/${crypto.randomUUID()}-${safeName(fileName)}`;

const keyBelongsToFirm = (key, firmId) => typeof key === 'string' && key.startsWith(`firms/${firmId}/`) && !key.includes('..');

/** Short-lived URL the browser PUTs the file to. The browser must send the same Content-Type. */
const presignUpload = async (key, contentType) => {
  ensureConfigured();
  const command = new PutObjectCommand({ Bucket: bucket, Key: key, ContentType: contentType });
  // Sign Content-Type too, so the upload is refused unless it is exactly the type we allowed.
  return getSignedUrl(s3, command, { expiresIn: UPLOAD_URL_TTL_SECONDS, signableHeaders: new Set(['content-type']) });
};

/** Short-lived URL that downloads the object under its original file name. */
const presignDownload = async (key, fileName) => {
  ensureConfigured();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(fileName || 'download')}`,
  });
  return getSignedUrl(s3, command, { expiresIn: DOWNLOAD_URL_TTL_SECONDS });
};

/** Size and type of an uploaded object, or null when nothing was uploaded under that key. */
const headObject = async (key) => {
  ensureConfigured();
  try {
    const res = await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return { size: res.ContentLength ?? 0, contentType: res.ContentType || null };
  } catch (error) {
    if (error?.$metadata?.httpStatusCode === 404 || error?.name === 'NotFound') return null;
    throw error;
  }
};

const deleteObject = async (key) => {
  ensureConfigured();
  await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }));
};

module.exports = {
  MAX_FILE_BYTES,
  UPLOAD_URL_TTL_SECONDS,
  DOWNLOAD_URL_TTL_SECONDS,
  ALLOWED_EXTENSIONS: Object.keys(ALLOWED_TYPES),
  contentTypeFor,
  buildKey,
  keyBelongsToFirm,
  presignUpload,
  presignDownload,
  headObject,
  deleteObject,
};
