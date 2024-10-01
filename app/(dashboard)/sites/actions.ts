"use server";

import { duplicateSite } from "@/lib/actions/sites";
import { revalidatePath } from "next/cache";

export async function handleDuplicate(siteId: number) {
  try {
    const newSite = await duplicateSite(siteId);
    revalidatePath("/sites");
    return { success: true, name: newSite.name };
  } catch (error) {
    console.error("Error duplicating site:", error);
    return { success: false, error: "Failed to duplicate site" };
  }
}
