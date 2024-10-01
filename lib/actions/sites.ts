"use server";

import { db } from "@/lib/db/drizzle";
import { sites } from "@/lib/db/schema";

export async function getSites(): Promise<{ id: number; name: string }[]> {
  return await db.select({ id: sites.id, name: sites.name }).from(sites);
}

// ... other site-related actions
