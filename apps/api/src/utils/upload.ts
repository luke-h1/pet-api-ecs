import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: process.env.S3_ASSETS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.S3_ASSETS_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_ASSETS_SECRET_ACCESS_KEY,
  },
});

/**
 * upload a file
 * @param file the file object to be uploaded
 * @param fileKey the fileKey. could be separated with '/' to nest the file into a folder structure. eg. members/user1/profile.png
 */
export async function uploadFile(file: File, fileKey: string) {
  const result = await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_ASSETS_BUCKET,
      Key: fileKey,
      Body: file as unknown as File,
    }),
  );
  return result;
}

export async function deleteFileByFilename(filenames: string[]) {
  const result = await Promise.all(
    filenames.map(filename =>
      s3Client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_ASSETS_BUCKET,
          Key: filename,
        }),
      ),
    ),
  );

  return result;
}
