import { pgTable, unique, serial, varchar, foreignKey, integer, text, check, boolean, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const categories = pgTable("categories", {
	typeId: serial("type_id").primaryKey().notNull(),
	typeName: varchar("type_name", { length: 100 }).notNull(),
}, (table) => [
	unique("categories_type_name_key").on(table.typeName),
]);

export const liquors = pgTable("liquors", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	typeId: integer("type_id"),
	imageLink: text("image_link"),
	description: text(),
	quantity: integer(),
	price: integer(),
}, (table) => [
	foreignKey({
			columns: [table.typeId],
			foreignColumns: [categories.typeId],
			name: "liquors_type_id_fkey"
		}),
]);

export const users = pgTable("users", {
	id: serial().primaryKey().notNull(),
	name: varchar({ length: 100 }),
	email: varchar({ length: 100 }).notNull(),
	password: text().notNull(),
	role: varchar({ length: 10 }).default('user').notNull(),
	verifyotp: varchar({ length: 50 }),
	verifyotpexpireat: integer(),
	isverified: boolean().default(false),
	resetotp: varchar({ length: 100 }),
	resetotpexpireat: integer(),
}, (table) => [
	unique("users_email_key").on(table.email),
	check("users_role_check", sql`(role)::text = ANY (ARRAY[('admin'::character varying)::text, ('user'::character varying)::text])`),
]);

export const refreshTokens = pgTable("refresh_tokens", {
	id: serial().primaryKey().notNull(),
	userId: integer("user_id").notNull(),
	token: text().notNull(),
	expiresAt: timestamp("expires_at", { mode: 'string' }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	revokedAt: timestamp("revoked_at", { mode: 'string' }),
});
