import { sql, eq, desc } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { orderItems, liquors, liquorVariants } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

export const fetchNetSales = async (tx: DbClient = db) => {
    const result = await tx.select({
        totalNetSales: sql<number>`SUM(${orderItems.quantity} * ${orderItems.priceAtPurchase})`.mapWith(Number)
    })
        .from(orderItems);

    return result[0]?.totalNetSales || 0;
};

export const fetchTotalProductsSold = async (tx: DbClient = db) => {
    const result = await tx.select({
        totalQuantity: sql<number>`SUM(${orderItems.quantity})`.mapWith(Number)
    }).from(orderItems);
    return result[0]?.totalQuantity || 0;
};

export const fetchProductSalesDetails = async (tx: DbClient = db) => {
    return await tx.select({
        productId: liquors.id,
        productName: liquors.name,
        totalQuantitySold: sql<number>`SUM(${orderItems.quantity})`.mapWith(Number),
        totalRevenue: sql<number>`SUM(${orderItems.quantity} * ${orderItems.priceAtPurchase})`.mapWith(Number),
    })
        .from(orderItems)
        .innerJoin(liquorVariants, eq(orderItems.variantId, liquorVariants.id))
        .innerJoin(liquors, eq(liquorVariants.liquorId, liquors.id))
        .groupBy(liquors.id, liquors.name)
        .orderBy(desc(sql`SUM(${orderItems.quantity})`));
};
