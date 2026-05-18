import { eq, desc, and, or, lte, gte } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { promotions } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";
import type { InferInsertModel } from "drizzle-orm";

export type NewPromotion = InferInsertModel<typeof promotions>;

export const fetchAllPromotions = async (tx: DbClient = db) => {
    return await tx.select().from(promotions).orderBy(desc(promotions.id));
};

export const fetchActivePromotions = async (tx: DbClient = db) => {
    return await tx
        .select({
            id: promotions.id,
            name: promotions.name,
            discountType: promotions.discountType,
            discountValue: promotions.discountValue,
            endDate: promotions.endDate,
        })
        .from(promotions)
        .where(eq(promotions.isActive, true));
};

export const fetchPromotionById = async (id: string, tx: DbClient = db) => {
    const result = await tx.select().from(promotions).where(eq(promotions.id, id));
    return result[0];
};

export const insertPromotion = async (data: NewPromotion, tx: DbClient = db) => {
    const result = await tx.insert(promotions).values(data).returning();
    return result[0];
};

export const updatePromotionById = async (id: string, data: Partial<NewPromotion>, tx: DbClient = db) => {
    const result = await tx.update(promotions).set(data).where(eq(promotions.id, id)).returning();
    return result[0];
};

export const softDeletePromotionById = async (id: string, tx: DbClient = db) => {
    const result = await tx.update(promotions).set({ isActive: false }).where(eq(promotions.id, id)).returning();
    return result[0];
};

export type ActivePromotion = {
    id: string;
    name: string;
    discountType: "percentage" | "fixed_amount";
    discountValue: number;
    variantId: string | null;
    liquorId: string | null;
    categoryId: string | null;
};

export const fetchActivePromotionsForVariant = async (
    variantId: string,
    liquorId: string,
    categoryId: string,
    tx: DbClient = db
): Promise<ActivePromotion[]> => {
    const now = new Date();

    const result = await tx
        .select({
            id: promotions.id,
            name: promotions.name,
            discountType: promotions.discountType,
            discountValue: promotions.discountValue,
            variantId: promotions.variantId,
            liquorId: promotions.liquorId,
            categoryId: promotions.categoryId,
        })
        .from(promotions)
        .where(
            and(
                eq(promotions.isActive, true),
                lte(promotions.startDate, now),
                gte(promotions.endDate, now),
                or(
                    eq(promotions.variantId, variantId),
                    eq(promotions.liquorId, liquorId),
                    eq(promotions.categoryId, categoryId)
                )
            )
        );

    return result;
};
