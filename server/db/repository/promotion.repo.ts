import { eq, desc } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { promotions } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";
import type { InferInsertModel } from "drizzle-orm";

export type NewPromotion = InferInsertModel<typeof promotions>;

export const fetchAllPromotions = async (tx: DbClient = db) => {
    return await tx.select().from(promotions).orderBy(desc(promotions.id));
};

export const fetchActivePromotions = async (tx: DbClient = db) => {
    const now = new Date();
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
