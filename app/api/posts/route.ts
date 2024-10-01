import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withAuth } from '../middleware';

export const GET = withAuth(async (request: Request) => {
  const searchParams = new URL(request.url).searchParams;
  const postTypeId = searchParams.get('postTypeId');

  let query = db.select().from(posts);
  if (postTypeId) {
    query = query.where(eq(posts.postTypeId, parseInt(postTypeId)));
  }

  const allPosts = await query;
  return NextResponse.json(allPosts);
});

export const POST = withAuth(async (request: Request) => {
  const { postTypeId, title, content } = await request.json();
  const userId = (request as any).user.userId;

  const newPost = await db.insert(posts).values({
    postTypeId,
    authorId: userId,
    title,
    content,
  }).returning();

  return NextResponse.json(newPost[0]);
});
