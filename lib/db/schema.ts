import { sql } from "drizzle-orm";
import { boolean, check, index, integer, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const user = pgTable("user", {
  id: text("id").primaryKey(), name: text("name").notNull(), email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(), image: text("image"), ...timestamps,
});
export const session = pgTable("session", {
  id: text("id").primaryKey(), expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(), userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  ipAddress: text("ip_address"), userAgent: text("user_agent"), ...timestamps,
}, (table) => [index("session_user_id_idx").on(table.userId)]);
export const account = pgTable("account", {
  id: text("id").primaryKey(), accountId: text("account_id").notNull(), providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"), refreshToken: text("refresh_token"), idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"), password: text("password"), ...timestamps,
}, (table) => [index("account_user_id_idx").on(table.userId), uniqueIndex("account_provider_account_idx").on(table.providerId, table.accountId)]);
export const verification = pgTable("verification", {
  id: text("id").primaryKey(), identifier: text("identifier").notNull(), value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(), ...timestamps,
}, (table) => [index("verification_identifier_idx").on(table.identifier)]);

export const rooms = pgTable("rooms", {
  id: uuid("id").defaultRandom().primaryKey(), name: text("name").notNull(), slug: text("slug").notNull().unique(),
  backgroundColor: text("background_color").notNull(), sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("rooms_sort_order_idx").on(table.sortOrder), check("rooms_hex_color", sql`${table.backgroundColor} ~ '^#[0-9A-Fa-f]{6}$'`)]);

export const artworks = pgTable("artworks", {
  id: uuid("id").defaultRandom().primaryKey(), roomId: uuid("room_id").notNull().references(() => rooms.id, { onDelete: "cascade" }),
  imageUrl: text("image_url").notNull(), imageWidth: integer("image_width").notNull(), imageHeight: integer("image_height").notNull(),
  name: text("name").notNull(), creator: text("creator").notNull(), year: text("year").notNull(),
  description: text("description"), size: text("size", { enum: ["small", "medium", "large", "full"] }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(), createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index("artworks_room_order_idx").on(table.roomId, table.sortOrder),
  check("artworks_size_check", sql`${table.size} in ('small','medium','large','full')`),
  check("artworks_image_width_check", sql`${table.imageWidth} > 0`),
  check("artworks_image_height_check", sql`${table.imageHeight} > 0`)]);
