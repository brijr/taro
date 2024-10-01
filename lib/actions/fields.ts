"use server";

import { db } from "@/lib/db/drizzle";
import { fields, type NewField, type Field } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod"; // Make sure to import zod if not already imported

// Update the fieldSchema definition to match the database schema
export const fieldSchema = z.object({
  name: z.string(),
  slug: z.string(),
  postTypeId: z.number(),
  type: z.string(),
  isRequired: z.boolean(),
  options: z.array(z.string()).optional(),
  order: z.number(),
});

export async function getFields(postTypeId: number) {
  return await db
    .select()
    .from(fields)
    .where(eq(fields.postTypeId, postTypeId));
}

export async function getField(id: number): Promise<Field | null> {
  const result = await db
    .select()
    .from(fields)
    .where(eq(fields.id, id))
    .limit(1);
  return result[0] || null;
}

export async function createField(
  data: Omit<NewField, "id" | "createdAt" | "updatedAt">
) {
  const order = await getNextOrder(data.postTypeId);
  const newFieldData = {
    ...data,
    slug: data.name.toLowerCase().replace(/\s+/g, "-"),
    order,
  };
  const validatedData = fieldSchema.parse(newFieldData);

  const newField = await db.insert(fields).values(validatedData).returning();
  revalidatePath(`/${validatedData.postTypeId}/post-types`);
  return newField[0];
}

export async function updateField(
  id: number,
  data: Partial<Omit<NewField, "id" | "createdAt" | "updatedAt">>
) {
  const existingField = await getField(id);
  if (!existingField) throw new Error("Field not found");

  const updateData = {
    ...data,
    ...(data.name && { slug: data.name.toLowerCase().replace(/\s+/g, "-") }),
  };

  const validatedData = fieldSchema.partial().parse(updateData);

  const updatedField = await db
    .update(fields)
    .set({
      ...validatedData,
      updatedAt: new Date(),
    })
    .where(eq(fields.id, id))
    .returning();

  revalidatePath(`/${existingField.postTypeId}/post-types`);
  return updatedField[0];
}

export async function deleteField(id: number) {
  const deletedField = await db
    .delete(fields)
    .where(eq(fields.id, id))
    .returning();
  revalidatePath(`/${deletedField[0].postTypeId}/post-types`);
  return deletedField[0];
}

export async function getFieldBySlug(
  postTypeId: number,
  slug: string
): Promise<Field | null> {
  const result = await db
    .select()
    .from(fields)
    .where(and(eq(fields.postTypeId, postTypeId), eq(fields.slug, slug)))
    .limit(1);
  return result[0] || null;
}

export async function reorderFields(postTypeId: number, fieldIds: number[]) {
  const updates = fieldIds.map((id, index) =>
    db
      .update(fields)
      .set({ order: index })
      .where(and(eq(fields.id, id), eq(fields.postTypeId, postTypeId)))
  );

  await Promise.all(updates);
  revalidatePath(`/${postTypeId}/post-types`);
}

export async function getFieldWithPostType(
  id: number
): Promise<(Field & { postType: any }) | null> {
  const result = await db.query.fields.findFirst({
    where: eq(fields.id, id),
    with: {
      postType: true,
    },
  });
  return result || null;
}

// Add this helper function at the end of the file
async function getNextOrder(postTypeId: number): Promise<number> {
  const result = await db
    .select({ maxOrder: sql<number>`COALESCE(MAX(${fields.order}), 0)` })
    .from(fields)
    .where(eq(fields.postTypeId, postTypeId));
  return (result[0]?.maxOrder ?? 0) + 1;
}
