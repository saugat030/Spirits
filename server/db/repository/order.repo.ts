import { eq, desc, and, count } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { orders, orderItems, liquorVariants, liquors, promotions } from "../schema/index.js";
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
    const result = await tx.select({
        id: orderItems.id,
        variantId: orderItems.variantId,
        appliedPromotionId: orderItems.appliedPromotionId,
        quantity: orderItems.quantity,
        originalPrice: orderItems.originalPrice,
        priceAtPurchase: orderItems.priceAtPurchase,
        discountAmount: orderItems.discountAmount,
        variant: {
            id: liquorVariants.id,
            size: liquorVariants.size,
            name: liquors.name,
            thumbnail: liquors.thumbnail_url,
        },
        promotion: {
            id: promotions.id,
            name: promotions.name,
            discountType: promotions.discountType,
            discountValue: promotions.discountValue,
        }
    })
    .from(orderItems)
    .innerJoin(liquorVariants, eq(orderItems.variantId, liquorVariants.id))
    .innerJoin(liquors, eq(liquorVariants.liquorId, liquors.id))
    .leftJoin(promotions, eq(orderItems.appliedPromotionId, promotions.id))
    .where(eq(orderItems.orderId, orderId));

    return result;
};



export const updateOrderStatusInDb = async (orderId: string, status: string, tx: DbClient = db) => {
    const result = await tx.update(orders)
        .set({ status: status as any, updatedAt: new Date() })
        .where(eq(orders.id, orderId))
        .returning();
    return result[0];
};

export const fetchAllOrders = async (options: {
    page?: number;
    limit?: number;
    status?: string;
    userId?: string;
}, tx: DbClient = db) => {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 20);
    const offset = (page - 1) * limit;

    const conditions = [];

    if (options.status) {
        conditions.push(eq(orders.status, options.status as any));
    }
    if (options.userId) {
        conditions.push(eq(orders.userId, options.userId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [ordersList, totalCountResult] = await Promise.all([
        tx.select()
            .from(orders)
            .where(whereClause)
            .orderBy(desc(orders.createdAt))
            .limit(limit)
            .offset(offset),
        tx.select({ total: count() })
            .from(orders)
            .where(whereClause),
    ]);

    const total = totalCountResult[0]?.total || 0;

    return {
        data: ordersList,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};
