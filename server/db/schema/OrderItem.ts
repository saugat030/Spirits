import { decimal, integer, pgTable, serial } from "drizzle-orm/pg-core";
import { orders } from "./Order.js";
import { liquors } from "./Liquor.js";

export const orderItems = pgTable("order_items", {
    id: serial("id").primaryKey(),
    orderId: integer("order_id")
        .references(() => orders.id, { onDelete: 'cascade' })
        .notNull(),
    spiritId: integer("spirit_id")
        .references(() => liquors.id)
        .notNull(),
    quantity: integer("quantity").notNull(),
    // store the price here so historical sales data never changes
    priceAtPurchase: decimal("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
});