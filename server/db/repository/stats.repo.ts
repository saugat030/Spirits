import { sql, eq, desc, ne, and, gte, lte } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { orderItems, liquors, liquorVariants, orders, categories } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

// Helper to calculate date boundaries
export const getDateBoundaries = (period: string) => {
    const now = new Date();
    const startDate = new Date();
    
    switch (period) {
        case '7d':
            startDate.setDate(now.getDate() - 7);
            break;
        case '30d':
            startDate.setDate(now.getDate() - 30);
            break;
        case '90d':
            startDate.setDate(now.getDate() - 90);
            break;
        case '12m':
            startDate.setMonth(now.getMonth() - 12);
            break;
        case 'all':
        default:
            return { startDate: new Date(0), endDate: now }; // From epoch
    }
    
    return { startDate, endDate: now };
};

export const fetchNetSales = async (period: string = '30d', tx: DbClient = db) => {
    const { startDate, endDate } = getDateBoundaries(period);

    const result = await tx.select({
        totalNetSales: sql<number>`SUM(${orderItems.quantity} * ${orderItems.priceAtPurchase})`.mapWith(Number)
    })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
            and(
                ne(orders.status, "cancelled"),
                gte(orders.createdAt, startDate),
                lte(orders.createdAt, endDate)
            )
        );

    return result[0]?.totalNetSales || 0;
};

export const fetchTotalProductsSold = async (period: string = '30d', tx: DbClient = db) => {
    const { startDate, endDate } = getDateBoundaries(period);

    const result = await tx.select({
        totalQuantity: sql<number>`SUM(${orderItems.quantity})`.mapWith(Number)
    })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .where(
             and(
                ne(orders.status, "cancelled"),
                gte(orders.createdAt, startDate),
                lte(orders.createdAt, endDate)
            )
        );
    return result[0]?.totalQuantity || 0;
};

export const fetchProductSalesDetails = async (period: string = '30d', tx: DbClient = db) => {
    const { startDate, endDate } = getDateBoundaries(period);

    return await tx.select({
        productId: liquors.id,
        productName: liquors.name,
        totalQuantitySold: sql<number>`SUM(${orderItems.quantity})`.mapWith(Number),
        totalRevenue: sql<number>`SUM(${orderItems.quantity} * ${orderItems.priceAtPurchase})`.mapWith(Number),
    })
        .from(orderItems)
        .innerJoin(orders, eq(orderItems.orderId, orders.id))
        .innerJoin(liquorVariants, eq(orderItems.variantId, liquorVariants.id))
        .innerJoin(liquors, eq(liquorVariants.liquorId, liquors.id))
        .where(
             and(
                ne(orders.status, "cancelled"),
                gte(orders.createdAt, startDate),
                lte(orders.createdAt, endDate)
            )
        )
        .groupBy(liquors.id, liquors.name)
        .orderBy(desc(sql`SUM(${orderItems.quantity})`));
};

export const fetchRevenueTrends = async (period: string = '30d', tx: DbClient = db) => {
    const { startDate, endDate } = getDateBoundaries(period);
    
    // Group by day for periods <= 90 days, else group by month
    const dateFormat = period === '12m' ? 'YYYY-MM' : 'YYYY-MM-DD';
    
    // We must use sql.raw() for the format string. If we pass it dynamically inside ${}, 
    // Drizzle treats it as a bound parameter ($1, $5, $6). Postgres will not recognize 
    // them as the exact same expression in SELECT, GROUP BY, and ORDER BY, causing an error.
    const dateQuery = sql<string>`TO_CHAR(${orders.createdAt}, ${sql.raw(`'${dateFormat}'`)})`;

    return await tx.select({
        date: dateQuery,
        revenue: sql<number>`SUM(${orders.totalAmount})`.mapWith(Number),
        ordersCount: sql<number>`COUNT(DISTINCT ${orders.id})`.mapWith(Number)
    })
    .from(orders)
    .where(
        and(
            ne(orders.status, "cancelled"),
            gte(orders.createdAt, startDate),
            lte(orders.createdAt, endDate)
        )
    )
    .groupBy(dateQuery)
    .orderBy(dateQuery);
};

export const fetchOrderStatusDistribution = async (period: string = '30d', tx: DbClient = db) => {
    const { startDate, endDate } = getDateBoundaries(period);

    return await tx.select({
        status: orders.status,
        count: sql<number>`COUNT(${orders.id})`.mapWith(Number)
    })
    .from(orders)
    .where(
        and(
            gte(orders.createdAt, startDate),
            lte(orders.createdAt, endDate)
        )
    )
    .groupBy(orders.status);
};

export const fetchProductsPerCategory = async (tx: DbClient = db) => {
    return await tx.select({
        categoryName: categories.category_name,
        productCount: sql<number>`COUNT(DISTINCT ${liquors.id})`.mapWith(Number)
    })
    .from(categories)
    .leftJoin(liquors, and(eq(liquors.categoryId, categories.id), eq(liquors.isActive, true)))
    .groupBy(categories.id, categories.category_name)
    .orderBy(desc(sql`COUNT(DISTINCT ${liquors.id})`));
};
