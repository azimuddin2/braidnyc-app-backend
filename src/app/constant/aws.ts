import { S3Client } from '@aws-sdk/client-s3';
import config from '../config';

export const getS3Client = (): S3Client => {
  return new S3Client({
    region: config.aws_region as string,
    credentials: {
      accessKeyId: config.aws_access_key_id as string,
      secretAccessKey: config.aws_secret_access_key as string,
    },
  });
};
