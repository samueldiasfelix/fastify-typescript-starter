import { S3Client } from '@aws-sdk/client-s3';

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const AWS_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
