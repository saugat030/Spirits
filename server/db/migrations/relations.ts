import { relations } from "drizzle-orm/relations";
import { categories, liquors } from "./schema";

export const liquorsRelations = relations(liquors, ({one}) => ({
	category: one(categories, {
		fields: [liquors.typeId],
		references: [categories.typeId]
	}),
}));

export const categoriesRelations = relations(categories, ({many}) => ({
	liquors: many(liquors),
}));