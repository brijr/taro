'use server'

import { db } from '@/lib/db/drizzle';
import { postTypes, type NewPostType } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getPostTypes(siteId: number) {
  return await db.select().from(postTypes).where(eq(postTypes.siteId, siteId));
}

export async function createPostType(data: NewPostType) {
  const newPostType = await db.insert(postTypes).values(data).returning();
  revalidatePath(`/sites/${data.siteId}/post-types`);
  return newPostType[0];
}

export async function updatePostType(id: number, data: Partial<NewPostType>) {
  const updatedPostType = await db
    .update(postTypes)
    .set(data)
    .where(eq(postTypes.id, id))
    .returning();
  revalidatePath(`/sites/${updatedPostType[0].siteId}/post-types`);
  return updatedPostType[0];
}

export async function deletePostType(id: number) {
  const deletedPostType = await db
    .delete(postTypes)
    .where(eq(postTypes.id, id))
    .returning();
  revalidatePath(`/sites/${deletedPostType[0].siteId}/post-types`);
  return deletedPostType[0];
}
