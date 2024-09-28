'use server'

import { db } from '@/lib/db/drizzle';
import { sites, type NewSite, type Site } from '@/lib/db/schema'; // Import Site type
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
  const newSite = await db.insert(sites).values(data).returning();
  revalidatePath(`/teams/${data.teamId}/sites`);
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

export async function getSiteWithPostTypes(id: number): Promise<(Site & { postTypes: any[] }) | null> {
  const result = await db.query.sites.findFirst({
    where: eq(sites.id, id),
    with: {
      postTypes: true,
    },
  });
  return result || null;
}

export async function getSiteWithPostTypesAndFields(id: number): Promise<(Site & { postTypes: any[] }) | null> {
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
  return result || null;
}

export async function duplicateSite(siteId: number) {
  const site = await getSite(siteId);
  if (!site) throw new Error('Site not found');

  const newSite = await db.insert(sites).values({
    teamId: site.teamId,
    name: `${site.name} Copy`,
    domain: `${site.domain}-copy`,
    isActive: site.isActive,
    settings: site.settings,
  }).returning();

  const postTypes = await getPostTypes(siteId);
  for (const postType of postTypes) {
    const newPostType = await db.insert(postTypes).values({
      siteId: newSite.id,
      name: postType.name,
      slug: `${postType.slug}-copy`,
      description: postType.description,
      fields: postType.fields,
      isActive: postType.isActive,
    }).returning();

    const fields = await getFields(postType.id);
    for (const field of fields) {
      await db.insert(fields).values({
        postTypeId: newPostType.id,
        name: field.name,
        slug: field.slug,
        type: field.type,
        isRequired: field.isRequired,
        defaultValue: field.defaultValue,
        options: field.options,
        order: field.order,
      });
    }
  }

  return newSite;
}
