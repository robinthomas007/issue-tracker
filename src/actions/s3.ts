'use server'
import { S3Client, DeleteObjectCommand, S3 } from "@aws-sdk/client-s3"

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  }
})
export async function deleteFileFromS3(key: string) {

  const deleteObjectCommand = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  })

  try {
    await s3.send(deleteObjectCommand)
  } catch (error) {
    console.log("error deleteFileFromS3", error)
  }

}