"use server";

import { db } from "@/lib/db/drizzle";
import { media, type NewMedia, type Media } from "@/lib/db/schema";
import { eq, and, like, sql, SQL } from "drizzle-orm";
import { PgSelect } from "drizzle-orm/pg-core";
import { revalidatePath } from "next/cache";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getMedia(
  siteId: number,
  page: number = 1,
  search: string = ""
): Promise<Media[]> {
  const pageSize = 10;
  const offset = (page - 1) * pageSize;

  let baseQuery = db.select().from(media).where(eq(media.siteId, siteId));

  if (search) {
    // @ts-ignore
    baseQuery = baseQuery.where(like(media.fileName, `%${search}%`));
  }

  const result = await baseQuery.limit(pageSize).offset(offset);
  return result;
}

export async function getMediaItem(id: number): Promise<Media | null> {
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0] || null;
}

export async function createMedia(
  data: Omit<NewMedia, "id" | "createdAt" | "updatedAt">,
  file: File
) {
  const key = `${Date.now()}-${file.name}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: file.type,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

  // Upload the file to S3 using the signed URL
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to S3");
  }

  const newMediaData = {
    ...data,
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    url: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
  };

  const newMedia = await db.insert(media).values(newMediaData).returning();

  revalidatePath(`/${newMediaData.siteId}/media`);
  return newMedia[0];
}

export async function updateMedia(
  id: number,
  data: Partial<Omit<NewMedia, "id" | "createdAt" | "updatedAt">>
) {
  const updatedMedia = await db
    .update(media)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(media.id, id))
    .returning();
  revalidatePath(`/${updatedMedia[0].siteId}/media`);
  return updatedMedia[0];
}

export async function deleteMedia(id: number) {
  const mediaItem = await getMediaItem(id);
  if (!mediaItem) {
    throw new Error("Media item not found");
  }

  // Delete the file from S3
  const key = mediaItem.url.split("/").pop()!;
  const deleteCommand = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
  });
  await s3Client.send(deleteCommand);

  const deletedMedia = await db
    .delete(media)
    .where(eq(media.id, id))
    .returning();
  revalidatePath(`/${deletedMedia[0].siteId}/media`);
  return deletedMedia[0];
}

export async function getSignedUploadUrl(fileName: string, fileType: string) {
  const key = `${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return { uploadUrl, key };
}

export async function getMediaForSite(siteId: number) {
  return await db.select().from(media).where(eq(media.siteId, siteId));
}
