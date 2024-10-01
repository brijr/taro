import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { posts } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { withAuth } from '../../middleware';

export const GET = withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const post = await db.select().from(posts).where(eq(posts.id, parseInt(params.id))).limit(1);

  if (!post[0]) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post[0]);
});

export const PUT = withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const { title, content } = await request.json();

  const updatedPost = await db.update(posts)
    .set({ title, content, updatedAt: new Date() })
    .where(eq(posts.id, parseInt(params.id)))
    .returning();

  if (!updatedPost[0]) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(updatedPost[0]);
});

export const DELETE = withAuth(async (request: Request, { params }: { params: { id: string } }) => {
  const deletedPost = await db.delete(posts)
    .where(eq(posts.id, parseInt(params.id)))
    .returning();

  if (!deletedPost[0]) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Post deleted successfully' });
});
