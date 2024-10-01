import { NextResponse } from 'next/server';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { sign } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

  if (!user[0] || !await bcrypt.compare(password, user[0].passwordHash)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = sign({ userId: user[0].id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return NextResponse.json({ token });
}
