import { pgTable, uuid, varchar, integer, text, boolean, pgEnum } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const roleEnum = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar({ length: 100 }).notNull(),
    email: varchar({ length: 100 }).notNull().unique("users_email_key"),
    password: text().notNull(),
    role: roleEnum("role").default("user").notNull(),
    verify_otp: varchar({ length: 50 }),
    verify_otp_expire_at: integer(),
    is_verified: boolean().default(false),
    resetotp: varchar({ length: 100 }),
    resetotpexpireat: integer(),
    is_active: boolean().default(false)
    //      (table) => [
    //      unique("users_email_key").on(table.email), another syntax for unique constraint
    //      check("users_role_check", sql`(role)::text = ANY (ARRAY[('admin'::character varying)::text, ('user'::character varying)::text])`),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

type UpdatableUserFields = Pick<NewUser, "name" | "email" | "role" | "is_verified" | "is_active">;
export type UserUpdateData = Partial<UpdatableUserFields>;