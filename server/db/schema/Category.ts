import { pgTable, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const categories = pgTable("categories", {
	typeId: uuid("type_id").defaultRandom().primaryKey().notNull(),
	typeName: varchar("type_name", { length: 100 }).notNull(),
}, (table) => [
	unique("categories_type_name_key").on(table.typeName),
]);

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

