import { pgTable, uuid, varchar, integer, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { categories } from "./Category";
import { liquors, liquorVariants } from "./Liquor";

export const discountTypeEnum = pgEnum("discount_type", ["percentage", "fixed_amount"]);

export const promotions = pgTable("promotions", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(), // e.g., "New Year Whiskey Sale 10% Off"

    discountType: discountTypeEnum("discount_type").notNull(),
    // if percentage, store 10. If fixed_amount, store 50000 (for Rs. 500 in paisa)
    discountValue: integer("discount_value").notNull(),

    // time-bound rules
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    isActive: boolean("is_active").default(true).notNull(),

    // TARGETING: Which items get this discount? (All are nullable)
    // If categoryId is set, ALL liquors in that category get the discount.
    categoryId: uuid("category_id").references(() => categories.id, { onDelete: 'cascade' }),

    // If liquorId is set, ALL variants of this specific liquor get it.
    liquorId: uuid("liquor_id").references(() => liquors.id, { onDelete: 'cascade' }),

    // If variantId is set, ONLY this specific variant gets it (e.g., your 500ml Smirnoff).
    variantId: uuid("variant_id").references(() => liquorVariants.id, { onDelete: 'cascade' }),
});