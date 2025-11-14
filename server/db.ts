import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, releases, InsertRelease, tracks, InsertTrack, news, InsertNews } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Release queries
export async function getAllReleases() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(releases).orderBy(releases.releaseDate);
}

export async function getLatestReleases(limit: number = 5) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(releases).orderBy(releases.releaseDate).limit(limit);
}

export async function getReleaseById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(releases).where(eq(releases.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createRelease(data: InsertRelease) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(releases).values(data);
  return Number(result[0].insertId);
}

export async function updateRelease(id: number, data: Partial<InsertRelease>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(releases).set(data).where(eq(releases.id, id));
}

export async function deleteRelease(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(tracks).where(eq(tracks.releaseId, id));
  await db.delete(releases).where(eq(releases.id, id));
}

// Track queries
export async function getAllTracks() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tracks).orderBy(tracks.releaseId, tracks.trackNumber);
}

export async function getTracksByReleaseId(releaseId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(tracks).where(eq(tracks.releaseId, releaseId)).orderBy(tracks.trackNumber);
}

export async function createTrack(data: InsertTrack) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(tracks).values(data);
  return Number(result[0].insertId);
}

export async function deleteTrack(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(tracks).where(eq(tracks.id, id));
}

// News queries
export async function getAllNews() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(news).orderBy(news.publishedAt);
}

export async function getNewsById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(news).where(eq(news.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNews(data: InsertNews) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(news).values(data);
  return Number(result[0].insertId);
}

export async function updateNews(id: number, data: Partial<InsertNews>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(news).set(data).where(eq(news.id, id));
}

export async function deleteNews(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(news).where(eq(news.id, id));
}
