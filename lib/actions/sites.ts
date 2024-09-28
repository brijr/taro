'use server'

import { db } from '@/lib/db/drizzle';
import { sites, postTypes, fields, type NewSite, type Site } from '@/lib/db/schema'; // Import Site type and postTypes table
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { siteSchema } from '@/lib/validations';
import { getPostTypes } from '@/lib/actions/post-types'; // Import getPostTypes function
import { getFields } from '@/lib/actions/fields'; // Import getFields function

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

  const newSiteArray = await db.insert(sites).values({
    teamId: site.teamId,
    name: `${site.name} Copy`,
    domain: `${site.domain}-copy`,
    isActive: site.isActive,
    settings: site.settings,
  }).returning();

  const newSite = newSiteArray[0]; // Access the first element of the array

  const existingPostTypes = await getPostTypes(siteId);
  for (const postType of existingPostTypes) {
    const newPostTypeArray = await db.insert(postTypes).values({
      siteId: newSite.id,
      name: postType.name,
      slug: `${postType.slug}-copy`,
      description: postType.description,
      fields: postType.fields,
      isActive: postType.isActive,
    }).returning();

    const newPostType = newPostTypeArray[0]; // Access the first element of the array

    const existingFields = await getFields(postType.id); // Rename fields to existingFields
    for (const field of existingFields) {
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
