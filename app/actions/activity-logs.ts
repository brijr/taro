'use server'

import { db } from '@/lib/db/drizzle';
import { activityLogs, type NewActivityLog, ActivityType } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getActivityLogs(teamId: number) {
  return await db.select().from(activityLogs).where(eq(activityLogs.teamId, teamId));
}

export async function createActivityLog(data: NewActivityLog) {
  const newLog = await db.insert(activityLogs).values(data).returning();
  revalidatePath(`/teams/${data.teamId}/activity`);
  return newLog[0];
}

export async function logActivity(teamId: number, userId: number | null, action: ActivityType, ipAddress?: string) {
  return await createActivityLog({
    teamId,
    userId,
    action,
    ipAddress,
  });
}

export async function deleteActivityLog(id: number) {
  const deletedLog = await db
    .delete(activityLogs)
    .where(eq(activityLogs.id, id))
    .returning();
  revalidatePath(`/teams/${deletedLog[0].teamId}/activity`);
  return deletedLog[0];
}
