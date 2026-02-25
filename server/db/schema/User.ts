import { pgTable, uuid, varchar, integer, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import {  type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const roleEnum = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar({ length: 100 }),
    email: varchar({ length: 100 }).notNull().unique("users_email_key"),
    password: text().notNull(),
    role: roleEnum("role").default("user").notNull(),
    verifyotp: varchar({ length: 50 }),
    verifyotpexpireat: integer(),
    isverified: boolean().default(false),
    resetotp: varchar({ length: 100 }),
    resetotpexpireat: integer(),
//      (table) => [
//      unique("users_email_key").on(table.email), another syntax for unique constraint
//      check("users_role_check", sql`(role)::text = ANY (ARRAY[('admin'::character varying)::text, ('user'::character varying)::text])`),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;