"use server";

import { db } from "@/lib/db/drizzle";
import { postTypes, type NewPostType, PostType } from "@/lib/db/schema";
import { revalidatePath } from "next/cache";
import { postTypeSchema, fieldSchema } from "@/lib/validations";
import { eq, and } from "drizzle-orm";

export async function getPostTypes(siteId: number): Promise<PostType[]> {
  return await db.select().from(postTypes).where(eq(postTypes.siteId, siteId));
}

export async function getPostType(id: number): Promise<PostType | null> {
  const result = await db
    .select()
    .from(postTypes)
    .where(eq(postTypes.id, id))
    .limit(1);
  return result[0] || null;
}

export async function createPostType(data: NewPostType) {
  const validatedData = postTypeSchema.parse(data);
  const newPostType = await db
    .insert(postTypes)
    .values(validatedData)
    .returning();
  revalidatePath(`/${validatedData.siteId}/post-types`);
  return newPostType[0];
}

export async function updatePostType(id: number, data: Partial<NewPostType>) {
  const validatedData = postTypeSchema.partial().parse(data);
  const updatedPostType = await db
    .update(postTypes)
    .set({
      ...validatedData,
      updatedAt: new Date(),
      fields: JSON.stringify(data.fields), // Convert fields array to JSON string
    })
    .where(eq(postTypes.id, id))
    .returning();
  revalidatePath(`/${updatedPostType[0].siteId}/post-types`);
  return updatedPostType[0];
}

export async function deletePostType(id: number) {
  const deletedPostType = await db
    .delete(postTypes)
    .where(eq(postTypes.id, id))
    .returning();
  revalidatePath(`/${deletedPostType[0].siteId}/post-types`);
  return deletedPostType[0];
}

export async function togglePostTypeStatus(id: number) {
  const postType = await getPostType(id);
  if (!postType) throw new Error("Post Type not found");

  const updatedPostType = await db
    .update(postTypes)
    .set({ isActive: !postType.isActive, updatedAt: new Date() })
    .where(eq(postTypes.id, id))
    .returning();
  revalidatePath(`/${updatedPostType[0].siteId}/post-types`);
  return updatedPostType[0];
}

export async function getPostTypeBySlug(
  siteId: number,
  slug: string
): Promise<PostType | null> {
  const result = await db
    .select()
    .from(postTypes)
    .where(and(eq(postTypes.siteId, siteId), eq(postTypes.slug, slug)))
    .limit(1);
  return result[0] || null;
}

export async function getPostTypeWithFields(
  id: number
): Promise<PostType | null> {
  const result = await db.query.postTypes.findFirst({
    where: eq(postTypes.id, id),
  });

  if (result) {
    return {
      ...result,
      fields: JSON.parse(result.fields as string),
    };
  }

  return null;
}

export async function getPostTypesWithFields(
  siteId: number
): Promise<PostType[]> {
  const result = await db.query.postTypes.findMany({
    where: eq(postTypes.siteId, siteId),
  });

  return result.map((postType) => ({
    ...postType,
    fields: JSON.parse(postType.fields as string),
  }));
}
