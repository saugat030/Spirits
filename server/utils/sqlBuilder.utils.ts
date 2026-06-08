import { asc, desc, eq, gte, lte, sql } from "drizzle-orm";
import { orders } from "../db/schema";

export type OrderFilterOptions = {
    page?: number;
    limit?: number;
    userId?: string;
    status?: string;
    search?: string;
    sortBy?: "date" | "status";
    sortOrder?: "asc" | "desc";
    dateFrom?: string;
    dateTo?: string;
};

export function buildOrderConditions(options: OrderFilterOptions, excludeStatus = false) {
    const conditions = [];

    if (options.userId) {
        conditions.push(eq(orders.userId, options.userId));
    }
    if (!excludeStatus && options.status && options.status !== "all") {
        conditions.push(eq(orders.status, options.status as any));
    }
    if (options.dateFrom) {
        conditions.push(gte(orders.createdAt, new Date(options.dateFrom)));
    }
    if (options.dateTo) {
        conditions.push(lte(orders.createdAt, new Date(options.dateTo + "T23:59:59.999Z")));
    }

    return conditions;
}

export function buildOrderByClause(sortBy?: string, sortOrder?: string) {
    const isAsc = sortOrder !== "desc";

    if (sortBy === "date") {
        return isAsc ? asc(orders.createdAt) : desc(orders.createdAt);
    }
    if (sortBy === "status") {
        const orderExpr = sql`CASE ${orders.status}
            WHEN 'pending' THEN 1
            WHEN 'processing' THEN 2
            WHEN 'shipped' THEN 3
            WHEN 'delivered' THEN 4
            WHEN 'cancelled' THEN 5
        END`;
        return isAsc ? asc(orderExpr) : desc(orderExpr);
    }

    return desc(orders.createdAt);
}
