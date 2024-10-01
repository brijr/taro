"use server";

import { db } from "@/lib/db/drizzle";
import { teams, type NewTeam } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getTeams() {
  return await db.select().from(teams);
}

export async function getTeam(id: number) {
  const result = await db.select().from(teams).where(eq(teams.id, id)).limit(1);
  return result[0] || null;
}

export async function createTeam(data: NewTeam) {
  const newTeam = await db.insert(teams).values(data).returning();
  revalidatePath("/teams");
  return newTeam[0];
}

export async function updateTeam(id: number, data: Partial<NewTeam>) {
  const updatedTeam = await db
    .update(teams)
    .set(data)
    .where(eq(teams.id, id))
    .returning();
  revalidatePath("/teams");
  return updatedTeam[0];
}

export async function deleteTeam(id: number) {
  const deletedTeam = await db
    .delete(teams)
    .where(eq(teams.id, id))
    .returning();
  revalidatePath("/teams");
  return deletedTeam[0];
}
