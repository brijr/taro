"use server";

import { db } from "@/lib/db/drizzle";
import { invitations, type NewInvitation } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getInvitations(teamId: number) {
  return await db
    .select()
    .from(invitations)
    .where(eq(invitations.teamId, teamId));
}

export async function getInvitation(id: number) {
  const result = await db
    .select()
    .from(invitations)
    .where(eq(invitations.id, id))
    .limit(1);
  return result[0] || null;
}

export async function createInvitation(data: NewInvitation) {
  const newInvitation = await db.insert(invitations).values(data).returning();
  revalidatePath(`/teams/${data.teamId}/invitations`);
  return newInvitation[0];
}

export async function updateInvitation(
  id: number,
  data: Partial<NewInvitation>
) {
  const updatedInvitation = await db
    .update(invitations)
    .set(data)
    .where(eq(invitations.id, id))
    .returning();
  revalidatePath(`/teams/${updatedInvitation[0].teamId}/invitations`);
  return updatedInvitation[0];
}

export async function deleteInvitation(id: number) {
  const deletedInvitation = await db
    .delete(invitations)
    .where(eq(invitations.id, id))
    .returning();
  revalidatePath(`/teams/${deletedInvitation[0].teamId}/invitations`);
  return deletedInvitation[0];
}
