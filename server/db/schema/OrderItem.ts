import { decimal, integer, pgTable, serial, uuid } from "drizzle-orm/pg-core";
import { orders } from "./Order.js";
import { liquors } from "./Liquor.js";

export const orderItems = pgTable("order_items", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    orderId: uuid("order_id")
        .references(() => orders.id, { onDelete: 'cascade' })
        .notNull(),
    spiritId: uuid("spirit_id")
        .references(() => liquors.id)
        .notNull(),
    quantity: integer("quantity").notNull(),
    // store the price here so historical sales data never changes
    priceAtPurchase: decimal("price_at_purchase", { precision: 10, scale: 2 }).notNull(),
});