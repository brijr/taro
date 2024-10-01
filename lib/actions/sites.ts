"use server";

import { db } from "@/lib/db/drizzle";
import { sites } from "@/lib/db/schema";

export async function getSites() {
  return await db.select().from(sites);
}

// ... other site-related actions

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

  const [newSite] = await db
    .insert(sites)
    .values({
      ...siteData,
      name: newSiteName,
    })
    .returning();

  for (const postType of originalSite.postTypes) {
    const { id: postTypeId, siteId: _, ...postTypeData } = postType;
    const [newPostType] = await db
      .insert(postTypes)
      .values({
        ...postTypeData,
        siteId: newSite.id,
      })
      .returning();

    for (const field of postType.fields) {
      const { id: fieldId, postTypeId: __, ...fieldData } = field;
      await db.insert(fields).values({
        ...fieldData,
        postTypeId: newPostType.id,
      });
    }
  }

  revalidatePath("/sites");
  return newSite;
}

export async function createSite(formData: FormData) {
  const name = formData.get("name") as string;
  const domain = formData.get("domain") as string;

  if (!name || !domain) {
    throw new Error("Name and domain are required");
  }

  const [newSite] = await db
    .insert(sites)
    .values({
      name,
      domain,
      teamId: 1, // Replace with actual team ID or get it from the session
    })
    .returning();

  revalidatePath("/sites");
  redirect("/sites");
}
