import { sql, eq, desc } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { orderItems, liquors } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

export const fetchNetSales = async (tx: DbClient = db) => {
    const result = await tx.select({
        totalNetSales: sql<number>`SUM(${orderItems.quantity} * ${liquors.price})`.mapWith(Number)
    })
        .from(orderItems)
        .innerJoin(liquors, eq(orderItems.spiritId, liquors.id));

    return result[0]?.totalNetSales || 0;
};

export const fetchTotalProductsSold = async (tx: DbClient = db) => {
    const result = await tx.select({
        totalQuantity: sql<number>`SUM(${orderItems.quantity})`.mapWith(Number)
    }).from(orderItems);
    // If there are no rows, SUM returns null. We safely default to 0.
    return result[0]?.totalQuantity || 0;
};

export const fetchProductSalesDetails = async (tx: DbClient = db) => {
    return await tx.select({
        productId: liquors.id,
        productName: liquors.name,
        // sum the quantity specifically for this group
        totalQuantitySold: sql<number>`SUM(${orderItems.quantity})`.mapWith(Number),
        // extra-how much money did this specific product make?
        totalRevenue: sql<number>`SUM(${orderItems.quantity} * ${orderItems.priceAtPurchase})`.mapWith(Number),
    })
        .from(orderItems)
        .innerJoin(liquors, eq(orderItems.spiritId, liquors.id))
        .groupBy(liquors.id, liquors.name)
        // order  from best-selling to worst-selling
        .orderBy(desc(sql`SUM(${orderItems.quantity})`));
};