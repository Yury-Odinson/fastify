import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	password: text("password").notNull(),
	lang: text("lang").default("en"),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const moods = pgTable("moods", {
	id: serial("id").primaryKey(),
	name: text("name").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});

export const userMoods = pgTable("user_moods", {
	id: serial("id").primaryKey(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
	moodId: integer("mood_id").notNull().references(() => moods.id, { onDelete: "cascade" }),
	note: text("note").default(""),
	createdAt: timestamp("created_at", { withTimezone: true }).default(sql`now()`),
	updatedAt: timestamp("updated_at", { withTimezone: true }).default(sql`now()`),
});
