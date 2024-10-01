"use server";

import { db } from "@/lib/db/drizzle";
import { users, type NewUser } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { hashPassword } from "@/lib/auth/session";

export async function getUsers() {
  return await db.select().from(users);
}

export async function getUser(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function createUser(
  data: Omit<NewUser, "passwordHash"> & { password: string }
) {
  const { password, ...userData } = data;
  const passwordHash = await hashPassword(password);
  const newUser = await db
    .insert(users)
    .values({ ...userData, passwordHash })
    .returning();
  revalidatePath("/users");
  return newUser[0];
}

export async function updateUser(id: number, data: Partial<NewUser>) {
  const updatedUser = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .returning();
  revalidatePath("/users");
  return updatedUser[0];
}

export async function deleteUser(id: number) {
  const deletedUser = await db
    .delete(users)
    .where(eq(users.id, id))
    .returning();
  revalidatePath("/users");
  return deletedUser[0];
}
