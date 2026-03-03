import { pgTable, serial, integer, varchar, timestamp, decimal, pgEnum, uuid } from "drizzle-orm/pg-core";
import { users } from "./index.js";

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
]);

// the orders table for recipt
export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    shippingAddress: varchar("shipping_address", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

