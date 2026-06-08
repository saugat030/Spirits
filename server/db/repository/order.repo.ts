import { eq, and, count, like, or, inArray } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { orders, orderItems, liquorVariants, liquors, promotions, users } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";
import { buildOrderByClause, buildOrderConditions, type OrderFilterOptions } from "../../utils/sqlBuilder.utils.js";

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

async function buildSearchConditions(
    search: string | undefined,
    isAdmin: boolean,
    tx: DbClient
): Promise<any[]> {
    if (!search) return [];

    const conditions = [like(orders.id, `%${search}%`)];
    if (isAdmin) {
        const matchingUsers = await tx
            .select({ id: users.id })
            .from(users)
            .where(like(users.name, `%${search}%`));
        if (matchingUsers.length > 0) {
            conditions.push(inArray(orders.userId, matchingUsers.map((u) => u.id)));
        }
    }
    return [or(...conditions)];
}

async function getOrdersSummary(
    baseConditions: any[],
    search: string | undefined,
    isAdmin: boolean,
    tx: DbClient
) {
    const conditions = [...baseConditions];

    const searchClauses = await buildSearchConditions(search, isAdmin, tx);
    if (searchClauses.length > 0) {
        conditions.push(...searchClauses);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"] as const;
    const counts = await Promise.all(
        statuses.map((s) =>
            tx
                .select({ count: count() })
                .from(orders)
                .where(
                    whereClause
                        ? and(whereClause, eq(orders.status, s as any))
                        : eq(orders.status, s as any)
                )
        )
    );

    const total = counts.reduce((sum, c) => sum + (c[0]?.count || 0), 0);

    return {
        total,
        pending: counts[0]?.[0]?.count || 0,
        processing: counts[1]?.[0]?.count || 0,
        shipped: counts[2]?.[0]?.count || 0,
        delivered: counts[3]?.[0]?.count || 0,
        cancelled: counts[4]?.[0]?.count || 0,
    };
}

export const insertOrder = async (params: CreateOrderParams, tx: DbClient = db) => {
    const result = await tx
        .insert(orders)
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

export const fetchOrdersByUserId = async (
    userId: string,
    options?: OrderFilterOptions,
    tx: DbClient = db
) => {
    const page = Math.max(1, options?.page || 1);
    const limit = Math.max(1, options?.limit || 20);
    const offset = (page - 1) * limit;

    const baseConditions = buildOrderConditions({ ...options, userId });
    const searchClauses = await buildSearchConditions(options?.search, false, tx);

    const allConditions =
        searchClauses.length > 0
            ? and(...baseConditions, ...searchClauses)
            : baseConditions.length > 0
                ? and(...baseConditions)
                : undefined;

    const orderBy = buildOrderByClause(options?.sortBy, options?.sortOrder);

    const [ordersList, totalCountResult, summary] = await Promise.all([
        tx
            .select()
            .from(orders)
            .where(allConditions)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset),
        tx
            .select({ total: count() })
            .from(orders)
            .where(allConditions),
        getOrdersSummary(
            buildOrderConditions({ ...options, userId }, true),
            options?.search,
            false,
            tx
        ),
    ]);

    const total = totalCountResult[0]?.total || 0;

    return {
        orders: ordersList,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        summary,
    };
};

export const fetchOrderById = async (orderId: string, tx: DbClient = db) => {
    const result = await tx
        .select()
        .from(orders)
        .where(eq(orders.id, orderId));
    return result[0];
};

export const fetchOrderItemsByOrderId = async (orderId: string, tx: DbClient = db) => {
    const result = await tx
        .select({
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
            },
        })
        .from(orderItems)
        .innerJoin(liquorVariants, eq(orderItems.variantId, liquorVariants.id))
        .innerJoin(liquors, eq(liquorVariants.liquorId, liquors.id))
        .leftJoin(promotions, eq(orderItems.appliedPromotionId, promotions.id))
        .where(eq(orderItems.orderId, orderId));

    return result;
};

export const updateOrderStatusInDb = async (orderId: string, status: string, tx: DbClient = db) => {
    const result = await tx
        .update(orders)
        .set({ status: status as any, updatedAt: new Date() })
        .where(eq(orders.id, orderId))
        .returning();
    return result[0];
};

export const fetchAllOrders = async (options: OrderFilterOptions, tx: DbClient = db) => {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, options.limit || 20);
    const offset = (page - 1) * limit;

    const baseConditions = buildOrderConditions(options);
    const searchClauses = await buildSearchConditions(options.search, true, tx);

    const allConditions =
        searchClauses.length > 0
            ? and(...baseConditions, ...searchClauses)
            : baseConditions.length > 0
                ? and(...baseConditions)
                : undefined;

    const orderBy = buildOrderByClause(options.sortBy, options.sortOrder);

    const [ordersList, totalCountResult, summary] = await Promise.all([
        tx
            .select()
            .from(orders)
            .where(allConditions)
            .orderBy(orderBy)
            .limit(limit)
            .offset(offset),
        tx
            .select({ total: count() })
            .from(orders)
            .where(allConditions),
        getOrdersSummary(
            buildOrderConditions(options, true),
            options.search,
            true,
            tx
        ),
    ]);

    const total = totalCountResult[0]?.total || 0;

    return {
        orders: ordersList,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        summary,
    };
};
