import { pgTable, integer, varchar, timestamp, pgEnum, uuid } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./index";
import { liquorVariants } from "./Liquor";
import { promotions } from "./Promotions";

export const orderStatusEnum = pgEnum("order_status", [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled"
]);

// future task
export const paymentMethodEnum = pgEnum("payment_method", ["cod", "stripe", "esewa", "paypal"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "paid", "failed", "refunded"]);

export const orders = pgTable("orders", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    userId: uuid("user_id").references(() => users.id).notNull(),
    totalAmount: integer("total_amount").notNull(),
    status: orderStatusEnum("status").default("pending").notNull(),
    // payment
    paymentMethod: paymentMethodEnum("payment_method").default("cod").notNull(),
    paymentStatus: paymentStatusEnum("payment_status").default("pending").notNull(),
    shippingAddress: varchar("shipping_address", { length: 500 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
    id: uuid("id").defaultRandom().primaryKey().notNull(),
    orderId: uuid("order_id")
        .references(() => orders.id, { onDelete: 'cascade' })
        .notNull(),
    variantId: uuid("variant_id")
        .references(() => liquorVariants.id)
        .notNull(),
    quantity: integer("quantity").notNull(),
    // prices
    originalPrice: integer("original_price").notNull(),
    // The final price the user actually paid (after discounts)
    priceAtPurchase: integer("price_at_purchase").notNull(),
    // How much was discounted per item? (originalPrice - priceAtPurchase)
    discountAmount: integer("discount_amount").default(0).notNull(),
    // Optional: Keep track of which promotion was applied for analytics
    appliedPromotionId: uuid("applied_promotion_id").references(() => promotions.id),
});

// drizzle relations
export const ordersRelations = relations(orders, ({ many, one }) => ({
    user: one(users, {
        fields: [orders.userId],
        references: [users.id],
    }),
    items: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, {
        fields: [orderItems.orderId],
        references: [orders.id],
    }),
    variant: one(liquorVariants, {
        fields: [orderItems.variantId],
        references: [liquorVariants.id],
    }),
}));