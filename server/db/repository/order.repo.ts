import { eq, desc } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { orders, orderItems } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

type NewOrderItem = {
    orderId: string;
    variantId: string;
    quantity: number;
    originalPrice: number;
    priceAtPurchase: number;
    discountAmount: number;
    appliedPromotionId?: string;
};

type CreateOrderParams = {
    userId: string;
    totalAmount: number;
    shippingAddress: string;
    paymentMethod: string | undefined;
};

export const insertOrder = async (params: CreateOrderParams, tx: DbClient = db) => {
    const result = await tx.insert(orders)
        .values({
            userId: params.userId,
            totalAmount: params.totalAmount,
            shippingAddress: params.shippingAddress,
            paymentMethod: (params.paymentMethod || "cod") as any,
        })
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

export const fetchOrderById = async (orderId: string, tx: DbClient = db) => {
    const result = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));
    return result[0];
};

export const fetchOrderItemsByOrderId = async (orderId: string, tx: DbClient = db) => {
    return await tx.select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));
};

export const updateOrderStatusInDb = async (orderId: string, status: string, tx: DbClient = db) => {
    const result = await tx.update(orders)
        .set({ status: status as any, updatedAt: new Date() })
        .where(eq(orders.id, orderId))
        .returning();
    return result[0];
};
