import { pgTable, uuid, varchar, integer, text } from "drizzle-orm/pg-core";
import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { categories } from "./Category.js";

export const liquors = pgTable("liquors", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: varchar({ length: 100 }).notNull(),
	typeId: uuid("type_id").references(() => categories.typeId, {
		onDelete: "cascade",
	}),
	imageLink: text("image_link"),
	description: text(),
	quantity: integer(),
	price: integer(),
});

export type Liquor = InferSelectModel<typeof liquors>;
export type NewLiquor = InferInsertModel<typeof liquors>;

