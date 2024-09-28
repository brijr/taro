'use server'

import { db } from '@/lib/db/drizzle';
import { sites, type NewSite, type Site } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { siteSchema } from '@/lib/validations';

export async function getSites(teamId: number) {
  return await db.select().from(sites).where(eq(sites.teamId, teamId));
}

export async function getSite(id: number): Promise<Site | null> {
  const result = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  return result[0] || null;
}

export async function createSite(data: NewSite) {
  const validatedData = siteSchema.parse(data);
  const newSite = await db.insert(sites).values(validatedData).returning();
  revalidatePath(`/teams/${validatedData.teamId}/sites`);
  return newSite[0];
}

export async function updateSite(id: number, data: Partial<NewSite>) {
  const validatedData = siteSchema.partial().parse(data);
  const updatedSite = await db
    .update(sites)
    .set({ ...validatedData, updatedAt: new Date() })
    .where(eq(sites.id, id))
    .returning();
  revalidatePath(`/teams/${updatedSite[0].teamId}/sites`);
  return updatedSite[0];
}

export async function deleteSite(id: number) {
  const deletedSite = await db
    .delete(sites)
    .where(eq(sites.id, id))
    .returning();
  revalidatePath(`/teams/${deletedSite[0].teamId}/sites`);
  return deletedSite[0];
}

export async function toggleSiteStatus(id: number) {
  const site = await getSite(id);
  if (!site) throw new Error('Site not found');

  const updatedSite = await db
    .update(sites)
    .set({ isActive: !site.isActive, updatedAt: new Date() })
    .where(eq(sites.id, id))
    .returning();
  revalidatePath(`/teams/${updatedSite[0].teamId}/sites`);
  return updatedSite[0];
}

export async function getSiteWithPostTypes(id: number): Promise<Site & { postTypes: any[] } | null> {
  const result = await db.query.sites.findFirst({
    where: eq(sites.id, id),
    with: {
      postTypes: true,
    },
  });
  return result;
}

export async function getSiteWithPostTypesAndFields(id: number): Promise<Site & { postTypes: any[] } | null> {
  const result = await db.query.sites.findFirst({
    where: eq(sites.id, id),
    with: {
      postTypes: {
        with: {
          fields: true,
        },
      },
    },
  });
  return result;
}
