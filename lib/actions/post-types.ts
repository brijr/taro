'use server'

import { db } from '@/lib/db/drizzle';
import { postTypes, fields, type PostType, type NewPostType } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { postTypeSchema } from '@/lib/validations';

export async function getPostTypes(siteId: number) {
  return await db.select().from(postTypes).where(eq(postTypes.siteId, siteId));
}

export async function getPostType(id: number): Promise<PostType | null> {
  const result = await db.select().from(postTypes).where(eq(postTypes.id, id)).limit(1);
  return result[0] || null;
}

export async function createPostType(data: NewPostType) {
  const validatedData = postTypeSchema.parse(data);
  const newPostType = await db.insert(postTypes).values(validatedData).returning();
  revalidatePath(`/sites/${validatedData.siteId}/post-types`);
  return newPostType[0];
}

export async function updatePostType(id: number, data: Partial<NewPostType>) {
  const validatedData = postTypeSchema.partial().parse(data);
  const updatedPostType = await db
    .update(postTypes)
    .set({ ...validatedData, updatedAt: new Date() })
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

export async function togglePostTypeStatus(id: number) {
  const postType = await getPostType(id);
  if (!postType) throw new Error('Post Type not found');

  const updatedPostType = await db
    .update(postTypes)
    .set({ isActive: !postType.isActive, updatedAt: new Date() })
    .where(eq(postTypes.id, id))
    .returning();
  revalidatePath(`/sites/${updatedPostType[0].siteId}/post-types`);
  return updatedPostType[0];
}

export async function getPostTypeBySlug(siteId: number, slug: string): Promise<PostType | null> {
  const result = await db
    .select()
    .from(postTypes)
    .where(and(eq(postTypes.siteId, siteId), eq(postTypes.slug, slug)))
    .limit(1);
  return result[0] || null;
}

export async function getPostTypeWithFields(id: number): Promise<PostType & { fields: any[] } | null> {
  const result = await db.query.postTypes.findFirst({
    where: eq(postTypes.id, id),
    with: {
      fields: true,
    },
  });
  return result;
}

export async function getPostTypesWithFields(siteId: number): Promise<(PostType & { fields: any[] })[]> {
  const result = await db.query.postTypes.findMany({
    where: eq(postTypes.siteId, siteId),
    with: {
      fields: true,
    },
  });
  return result;
}
