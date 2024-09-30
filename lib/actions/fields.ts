"use server";

import { db } from "@/lib/db/drizzle";
import { fields, type NewField, type Field } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { fieldSchema } from "@/lib/validations";

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

export async function createField(data: NewField) {
  const validatedData = fieldSchema.parse({
    ...data,
    options: data.options || {}, // Ensure options is an object
  });
  const newField = await db.insert(fields).values(validatedData).returning();
  revalidatePath(`/${validatedData.postTypeId}/post-types`);
  return newField[0];
}

export async function updateField(id: number, data: Partial<NewField>) {
  const validatedData = fieldSchema.partial().parse({
    ...data,
    options: data.options || {}, // Ensure options is an object
  });
  const updatedField = await db
    .update(fields)
    .set({ ...validatedData, updatedAt: new Date() })
    .where(eq(fields.id, id))
    .returning();
  revalidatePath(`/${updatedField[0].postTypeId}/post-types`);
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
  slug: string,
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
      .where(and(eq(fields.id, id), eq(fields.postTypeId, postTypeId))),
  );

  await Promise.all(updates);
  revalidatePath(`/${postTypeId}/post-types`);
}

export async function getFieldWithPostType(
  id: number,
): Promise<(Field & { postType: any }) | null> {
  const result = await db.query.fields.findFirst({
    where: eq(fields.id, id),
    with: {
      postType: true,
    },
  });
  return result || null;
}
