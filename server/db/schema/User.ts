import { pgTable, unique, serial, varchar, integer, text, check, boolean } from "drizzle-orm/pg-core";
import { sql, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

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

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;