const { S3Client } = require('@aws-sdk/client-s3');

/**
 * S3-compatible object storage (Cloudflare R2 in production).
 * R2: S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com and S3_REGION=auto.
 * The app still boots without these; storage endpoints answer 503 until they are set.
 */
const {
  S3_ENDPOINT,
  S3_REGION = 'auto',
  S3_BUCKET,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
} = process.env;

const isStorageConfigured = Boolean(S3_BUCKET && S3_ACCESS_KEY_ID && S3_SECRET_ACCESS_KEY);

const s3 = isStorageConfigured
  ? new S3Client({
      region: S3_REGION,
      endpoint: S3_ENDPOINT || undefined,
      credentials: { accessKeyId: S3_ACCESS_KEY_ID, secretAccessKey: S3_SECRET_ACCESS_KEY },
      // Only add checksums when an operation needs them; otherwise presigned browser
      // uploads would have to send checksum headers the browser can't compute up front.
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    })
  : null;

module.exports = { s3, bucket: S3_BUCKET, isStorageConfigured };
