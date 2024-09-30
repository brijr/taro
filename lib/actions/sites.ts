"use server";

import { db } from "@/lib/db/drizzle";
import { sites, postTypes, fields, type Site } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSites(teamId: number): Promise<Site[]> {
  return await db.select().from(sites).where(eq(sites.teamId, teamId));
}

export async function getSite(id: number): Promise<Site | null> {
  const result = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  return result[0] || null;
}

export async function createSite(data: NewSite) {
  const newSite = await db.insert(sites).values(data).returning();
  revalidatePath(`/`);
  return newSite[0];
}

export async function updateSite(id: number, data: Partial<NewSite>) {
  const updatedSite = await db
    .update(sites)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(sites.id, id))
    .returning();
  revalidatePath(`/`);
  return updatedSite[0];
}

export async function deleteSite(formData: FormData) {
  const id = parseInt(formData.get("id") as string, 10);
  if (isNaN(id)) {
    throw new Error("Invalid site ID");
  }

  // Delete related fields
  const postTypesToDelete = await db
    .select()
    .from(postTypes)
    .where(eq(postTypes.siteId, id));
  for (const postType of postTypesToDelete) {
    await db.delete(fields).where(eq(fields.postTypeId, postType.id));
  }

  // Delete related post types
  await db.delete(postTypes).where(eq(postTypes.siteId, id));

  // Delete the site
  const deletedSite = await db
    .delete(sites)
    .where(eq(sites.id, id))
    .returning();
  revalidatePath(`/`);
  return deletedSite[0];
}
