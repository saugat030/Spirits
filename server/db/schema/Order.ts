import { pgTable, serial, integer, varchar, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./index.js";

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
]);

// the orders table (The "Receipt")
export const orders = pgTable("orders", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").references(() => users.id).notNull(), // Who bought it
    // decimal is perfect for currency (10 digits total, 2 after the decimal)
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    shippingAddress: varchar("shipping_address", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

