// "A USER BROWSES A PRODUCT BUT THEY BUY A VARIANT"

import { pgTable, uuid, varchar, integer, text, jsonb, boolean } from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { categories } from "./Category";
import type { Image } from "../../types/types";

export const liquors = pgTable("liquors", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: varchar("name", { length: 100 }).notNull(),
	categoryId: uuid("category_id").references(() => categories.id, {
		onDelete: "cascade",
	}),
	description: text("description"),
	thumbnail_url: text("thumbnail_url").notNull(),
	images: jsonb("images").$type<Image[]>(),
	// soft delete entire product line hide garna including variants
	isActive: boolean("is_active").default(true).notNull(),
});

export const liquorVariants = pgTable("liquor_variants", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	liquorId: uuid("liquor_id").references(() => liquors.id, {
		onDelete: "cascade",
	}).notNull(),
	size: varchar("size", { length: 50 }).notNull(), // "750ml", "1 Liter"
	sku: varchar("sku", { length: 100 }).unique().notNull(),
	price: integer("price").notNull(), // 0.1 + 0.2 = 0.30000000000000004 avoid garna store it as paisa no flaoting point
	inventoryQuantity: integer("inventory_quantity").default(0).notNull(),
	// optinal
	variantImage: jsonb("variant_image").$type<Image>(),
	// soft delete for this specific variant 
	isActive: boolean("is_active").default(true).notNull(),
});

// DRIZZLE RELATIONS (For easy fetching)
export const liquorsRelations = relations(liquors, ({ many }) => ({
	variants: many(liquorVariants),
}));

export const liquorVariantsRelations = relations(liquorVariants, ({ one }) => ({
	liquor: one(liquors, {
		fields: [liquorVariants.liquorId],
		references: [liquors.id],
	}),
}));

export type Liquor = InferSelectModel<typeof liquors>;
export type NewLiquor = InferInsertModel<typeof liquors>;

export type LiquorVariant = InferSelectModel<typeof liquorVariants>;
export type NewLiquorVariant = InferInsertModel<typeof liquorVariants>;