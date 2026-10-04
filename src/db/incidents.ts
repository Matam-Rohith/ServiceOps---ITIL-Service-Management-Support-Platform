import { db } from './index.ts';
import { incidents, incidentComments } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getDbIncidents() {
  try {
    return await db.select().from(incidents).orderBy(desc(incidents.createdAt));
  } catch (error) {
    console.error("Failed to fetch incidents:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function insertDbIncident(data: typeof incidents.$inferInsert) {
  try {
    const result = await db.insert(incidents).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert incident:", error);
    throw new Error("Failed to insert incident into database", { cause: error });
  }
}

export async function getDbComments(incidentId: string) {
  try {
    return await db.select().from(incidentComments).where(eq(incidentComments.incidentId, incidentId)).orderBy(desc(incidentComments.createdAt));
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function insertDbComment(data: typeof incidentComments.$inferInsert) {
  try {
    const result = await db.insert(incidentComments).values(data).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to insert comment:", error);
    throw new Error("Failed to insert comment into database", { cause: error });
  }
}
