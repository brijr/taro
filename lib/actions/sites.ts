"use server";

import { db } from "@/lib/db/drizzle";
import { sites, postTypes, fields } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSites(): Promise<{ id: number; name: string }[]> {
  return await db.select({ id: sites.id, name: sites.name }).from(sites);
}

// ... other existing site-related actions

export async function duplicateSite(siteId: number) {
  const originalSite = await db.query.sites.findFirst({
    where: eq(sites.id, siteId),
    with: {
      postTypes: {
        with: {
          fields: true,
        },
      },
    },
  });

  if (!originalSite) {
    throw new Error("Site not found");
  }

  const { id, createdAt, updatedAt, ...siteData } = originalSite;
  const newSiteName = `${siteData.name} (Copy)`;

  const [newSite] = await db.insert(sites).values({
    ...siteData,
    name: newSiteName,
  }).returning();

  for (const postType of originalSite.postTypes) {
    const { id: postTypeId, siteId: _, ...postTypeData } = postType;
    const [newPostType] = await db.insert(postTypes).values({
      ...postTypeData,
      siteId: newSite.id,
    }).returning();

    for (const field of postType.fields) {
      const { id: fieldId, postTypeId: __, ...fieldData } = field;
      await db.insert(fields).values({
        ...fieldData,
        postTypeId: newPostType.id,
      });
    }
  }

  revalidatePath('/sites');
  return newSite;
}
