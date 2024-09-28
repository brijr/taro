'use server'

import { db } from '@/lib/db/drizzle';
import { media, type NewMedia } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getMedia(siteId: number) {
  return await db.select().from(media).where(eq(media.siteId, siteId));
}

export async function getMediaItem(id: number) {
  const result = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return result[0] || null;
}

export async function createMedia(data: NewMedia) {
  const newMedia = await db.insert(media).values(data).returning();
  revalidatePath(`/sites/${data.siteId}/media`);
  return newMedia[0];
}

export async function updateMedia(id: number, data: Partial<NewMedia>) {
  const updatedMedia = await db
    .update(media)
    .set(data)
    .where(eq(media.id, id))
    .returning();
  revalidatePath(`/sites/${updatedMedia[0].siteId}/media`);
  return updatedMedia[0];
}

export async function deleteMedia(id: number) {
  const deletedMedia = await db
    .delete(media)
    .where(eq(media.id, id))
    .returning();
  revalidatePath(`/sites/${deletedMedia[0].siteId}/media`);
  return deletedMedia[0];
}
