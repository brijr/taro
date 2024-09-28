'use server'

import { db } from '@/lib/db/drizzle';
import { posts, type NewPost } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getPosts(postTypeId: number) {
  return await db.select().from(posts).where(eq(posts.postTypeId, postTypeId));
}

export async function getPost(id: number) {
  const result = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return result[0] || null;
}

export async function createPost(data: NewPost) {
  const newPost = await db.insert(posts).values(data).returning();
  revalidatePath(`/sites/${data.postTypeId}/posts`);
  return newPost[0];
}

export async function updatePost(id: number, data: Partial<NewPost>) {
  const updatedPost = await db
    .update(posts)
    .set(data)
    .where(eq(posts.id, id))
    .returning();
  revalidatePath(`/sites/${updatedPost[0].postTypeId}/posts`);
  return updatedPost[0];
}

export async function deletePost(id: number) {
  const deletedPost = await db
    .delete(posts)
    .where(eq(posts.id, id))
    .returning();
  revalidatePath(`/sites/${deletedPost[0].postTypeId}/posts`);
  return deletedPost[0];
}

export async function publishPost(id: number) {
  const publishedPost = await db
    .update(posts)
    .set({ isPublished: true, publishedAt: new Date(), status: 'published' })
    .where(eq(posts.id, id))
    .returning();
  revalidatePath(`/sites/${publishedPost[0].postTypeId}/posts`);
  return publishedPost[0];
}

export async function unpublishPost(id: number) {
  const unpublishedPost = await db
    .update(posts)
    .set({ isPublished: false, status: 'draft' })
    .where(eq(posts.id, id))
    .returning();
  revalidatePath(`/sites/${unpublishedPost[0].postTypeId}/posts`);
  return unpublishedPost[0];
}
