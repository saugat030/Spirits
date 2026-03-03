// src/db/repository/order.repo.ts
import { eq, desc } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { orders, orderItems } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";
type NewOrderItem = { orderId: string; spiritId: string; quantity: number; priceAtPurchase: string };

export const insertOrder = async (userId: string, totalAmount: number, tx: DbClient = db) => {
    const result = await tx.insert(orders)
        .values({ userId, totalAmount: totalAmount.toString() })
        .returning();
    return result[0];
};

export const insertOrderItems = async (items: NewOrderItem[], tx: DbClient = db) => {
    return await tx.insert(orderItems).values(items).returning();
};

export const fetchOrdersByUserId = async (userId: string, tx: DbClient = db) => {
    return await tx.select()
        .from(orders)
        .where(eq(orders.userId, userId))
        .orderBy(desc(orders.createdAt));
};

export const updateOrderStatusInDb = async (orderId: string, status: string, tx: DbClient = db) => {
    const result = await tx.update(orders)
        .set({ status: status as any }) // cast to any to bypass strict enum type check dynamically
        .where(eq(orders.id, orderId))
        .returning();
    return result[0];
};