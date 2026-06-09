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
  /** Username for local authentication (unique) */
  username: varchar("username", { length: 64 }).notNull().unique(),
  /** Bcrypt password hash (never store plain passwords) */
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  /** Legacy: Manus OAuth identifier (optional, kept for compatibility) */
  openId: varchar("openId", { length: 64 }).unique(),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Posts table for Oraculum - stores literary texts and aforismos
 * dateOriginal: When the text was originally written (YYYY-MM-DD format)
 * datePublished: When it was published on the platform
 */
export const posts = mysqlTable("posts", {
  id: int("id").autoincrement().primaryKey(),
  content: text("content").notNull(), // Full text content
  dateOriginal: varchar("dateOriginal", { length: 10 }).notNull(), // YYYY-MM-DD format
  datePublished: timestamp("datePublished").defaultNow().notNull(), // Publication date
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Post = typeof posts.$inferSelect;
export type InsertPost = typeof posts.$inferInsert;

// TODO: Add your tables here
