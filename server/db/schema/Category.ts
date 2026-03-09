import { pgTable, text, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";

export const categories = pgTable("categories", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	category_name: varchar("category_name", { length: 100 }).notNull(),
	category_image_url: text().notNull().default("/placeholder-image.png")
}, (table) => [
	unique("categories_name_key").on(table.category_name),
]);

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

