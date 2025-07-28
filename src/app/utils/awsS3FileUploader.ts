import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import AppError from '../errors/AppError';
import config from '../config';
import { getS3Client } from '../constant/aws';

// Upload a single file to S3
export const uploadToS3 = async ({
  file,
  fileName,
}: {
  file: Express.Multer.File;
  fileName: string;
}): Promise<string | null> => {
  const s3Client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: config.aws_bucket,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  try {
    const result = await s3Client.send(command);

    if (!result) {
      throw new AppError(400, 'File upload failed');
    }

    return `https://${config.aws_bucket}.s3.${config.aws_region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('uploadToS3 error:', error);
    throw new AppError(400, 'File upload failed');
  }
};

// Delete a single file from S3
export const deleteFromS3 = async (key: string): Promise<void> => {
  const s3Client = getS3Client();

  try {
    const command = new DeleteObjectCommand({
      Bucket: config.aws_bucket,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    console.error('deleteFromS3 error:', error);
    throw new AppError(400, 'S3 file delete failed');
  }
};

// Upload multiple files to S3
export const uploadManyToS3 = async (
  files: {
    file: Express.Multer.File;
    path: string;
    key?: string;
    extension?: string;
  }[],
): Promise<{ url: string; key: string }[]> => {
  const s3Client = getS3Client();

  try {
    const uploadPromises = files.map(async ({ file, path, key, extension }) => {
      const uniqueKey =
        key || `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;
      const fileKey = `${path}/${uniqueKey}.${extension}`;

      const command = new PutObjectCommand({
        Bucket: config.aws_bucket,
        Key: fileKey,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3Client.send(command);

      return {
        url: `https://${config.aws_bucket}.s3.${config.aws_region}.amazonaws.com/${fileKey}`,
        key: uniqueKey,
      };
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error('uploadManyToS3 error:', error);
    throw new AppError(400, 'Multiple file upload failed');
  }
};

// Delete multiple files from S3
export const deleteManyFromS3 = async (keys: string[]): Promise<void> => {
  const s3Client = getS3Client();

  try {
    const command = new DeleteObjectsCommand({
      Bucket: config.aws_bucket,
      Delete: {
        Objects: keys.map((key) => ({ Key: key })),
        Quiet: false,
      },
    });

    await s3Client.send(command);
  } catch (error) {
    console.error('deleteManyFromS3 error:', error);
    throw new AppError(400, 'Multiple S3 file delete failed');
  }
};

// Upload a file with progress tracking
export const uploadWithProgress = async (
  { file, fileName }: { file: Express.Multer.File; fileName: string },
  onProgress: (progress: number) => void,
): Promise<string> => {
  const s3Client = getS3Client();

  try {
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: config.aws_bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
      },
    });

    upload.on('httpUploadProgress', (progress) => {
      if (progress.total && progress.loaded) {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        onProgress(percentage);
      }
    });

    await upload.done();

    return `https://${config.aws_bucket}.s3.${config.aws_region}.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('uploadWithProgress error:', error);
    throw new AppError(400, 'File upload with progress failed');
  }
};
