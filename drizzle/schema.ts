import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Releases table for music label albums and singles
 */
export const releases = mysqlTable("releases", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  releaseDate: timestamp("releaseDate").notNull(),
  description: text("description"),
  format: mysqlEnum("format", [
    "Digital Album",
    "Digital Single",
    "Digital USB Stick",
    "CD Single",
    "CD Album",
    "Vinyl Album",
    "Vinyl Single",
    "Cassette"
  ]).notNull(),
  imageUrl: text("imageUrl"),
  audioPreviewUrl: text("audioPreviewUrl"),
  youtubeLink: text("youtubeLink"),
  spotifyLink: text("spotifyLink"),
  appleMusicLink: text("appleMusicLink"),
  storeLink: text("storeLink"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Release = typeof releases.$inferSelect;
export type InsertRelease = typeof releases.$inferInsert;

/**
 * Tracks table for individual songs in releases
 */
export const tracks = mysqlTable("tracks", {
  id: int("id").autoincrement().primaryKey(),
  releaseId: int("releaseId").notNull(),
  trackNumber: int("trackNumber").notNull(),
  artist: varchar("artist", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  length: varchar("length", { length: 10 }).notNull(), // Format: MM:SS
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Track = typeof tracks.$inferSelect;
export type InsertTrack = typeof tracks.$inferInsert;

/**
 * News table for label news and announcements
 */
export const news = mysqlTable("news", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  imageUrl: text("imageUrl"),
  publishedAt: timestamp("publishedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type News = typeof news.$inferSelect;
export type InsertNews = typeof news.$inferInsert;