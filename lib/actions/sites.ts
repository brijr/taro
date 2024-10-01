"use server";

import { db } from "@/lib/db/drizzle";
import {
  sites,
  postTypes,
  fields,
  type Site,
  type PostType,
  type Field,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session"; // Assuming you have a session management utility

export async function getSites(): Promise<Site[]> {
  return await db.select().from(sites);
}

export async function duplicateSite(siteId: number): Promise<Site> {
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

  const { id, createdAt, updatedAt, postTypes, ...siteData } = originalSite;
  const newSiteName = `${siteData.name} (Copy)`;

  const [newSite] = await db
    .insert(sites)
    .values({
      ...siteData,
      name: newSiteName,
    })
    .returning();

  await Promise.all(
    postTypes.map(async (postType: PostType) => {
      const {
        id: postTypeId,
        siteId: _,
        fields: originalFields,
        ...postTypeData
      } = postType;
      const [newPostType] = await db
        .insert(postTypes)
        .values({
          ...postTypeData,
          siteId: newSite.id,
        })
        .returning();

      await Promise.all(
        originalFields.map(async (field: Field) => {
          const { id: fieldId, postTypeId: __, ...fieldData } = field;
          await db.insert(fields).values({
            ...fieldData,
            postTypeId: newPostType.id,
          });
        })
      );
    })
  );

  revalidatePath("/sites");
  return newSite;
}

export async function createSite(formData: FormData): Promise<void> {
  const name = formData.get("name") as string;
  const domain = formData.get("domain") as string;

  if (!name || !domain) {
    throw new Error("Name and domain are required");
  }

  const session = await getSession();
  const teamId = session?.teamId; // Replace with actual team ID from the session

  if (!teamId) {
    throw new Error("Team ID is required");
  }

  const [newSite] = await db
    .insert(sites)
    .values({
      name,
      domain,
      teamId,
    })
    .returning();

  revalidatePath("/sites");
  redirect("/sites");
}

// Add this function if it doesn't exist
export async function getSite(id: number): Promise<Site | null> {
  const result = await db.select().from(sites).where(eq(sites.id, id)).limit(1);
  return result[0] || null;
}
