import { pgTable, uuid, varchar, integer, text, jsonb } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { categories } from "./Category";
import type { Image } from "../../types/types";

export const liquors = pgTable("liquors", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	categoryId: uuid("category_id").references(() => categories.id, {
		onDelete: "cascade",
	}),
	thumbnail_url: text("thumbnail_url").notNull(),
	images: jsonb("images").$type<Image[]>(),
	description: text(),
	quantity: integer().notNull(),
	price: integer().notNull(),
});

export type Liquor = InferSelectModel<typeof liquors>;
export type NewLiquor = InferInsertModel<typeof liquors>;

