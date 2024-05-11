import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
  },
});
const bucket = process.env.BUCKET;

type UploadToS3ReturnType = {
  key?: string;
  error?: unknown;
};

export const uploadToS3 = async (
  file: Blob,
  userId: string
): Promise<UploadToS3ReturnType> => {
  const key = `${userId}/${uuidv4()}.jpeg`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: "image/jpeg",
  });

  try {
    await s3.send(command);
    return { key, error: undefined } as UploadToS3ReturnType;
  } catch (error) {
    console.log(error.data);
    return { key: undefined, error } as UploadToS3ReturnType;
  }
};

export const getFromS3 = async (key) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  try {
    const file = await s3.send(command);
    return { file };
  } catch (error) {
    console.log(error);
    return { error };
  }
};
