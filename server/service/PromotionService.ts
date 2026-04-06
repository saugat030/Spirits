import { db } from "../config/dbConnect.js";
import {
    fetchAllPromotions,
    fetchActivePromotions,
    fetchPromotionById,
    insertPromotion,
    updatePromotionById,
    softDeletePromotionById,
} from "../db/repository/promotion.repo.js";

type CreatePromotionDTO = {
    name: string;
    discountType: "percentage" | "fixed_amount";
    discountValue: number;
    startDate: Date;
    endDate: Date;
    isActive?: boolean;
    categoryId?: string;
    liquorId?: string;
    variantId?: string;
};

type UpdatePromotionDTO = {
    name?: string;
    discountType?: "percentage" | "fixed_amount";
    discountValue?: number;
    startDate?: Date;
    endDate?: Date;
    isActive?: boolean;
    categoryId?: string | null;
    liquorId?: string | null;
    variantId?: string | null;
};

const validatePromotionTarget = (categoryId?: string | null, liquorId?: string | null, variantId?: string | null) => {
    const targetCount = [categoryId, liquorId, variantId].filter(Boolean).length;

    if (targetCount === 0) {
        throw new Error("PROMOTION_TARGET_REQUIRED");
    }

    if (targetCount > 1) {
        throw new Error("PROMOTION_ONLY_ONE_TARGET");
    }
};

export const getAllPromotionsService = async () => {
    return await fetchAllPromotions();
};

export const getActivePromotionsService = async () => {
    return await fetchActivePromotions();
};

export const getPromotionByIdService = async (id: string) => {
    const promotion = await fetchPromotionById(id);
    if (!promotion) {
        throw new Error("PROMOTION_NOT_FOUND");
    }
    return promotion;
};

export const createPromotionService = async (data: CreatePromotionDTO) => {
    validatePromotionTarget(data.categoryId, data.liquorId, data.variantId);

    if (data.discountType === "percentage" && (data.discountValue < 0 || data.discountValue > 100)) {
        throw new Error("INVALID_PERCENTAGE");
    }

    if (data.discountValue < 0) {
        throw new Error("INVALID_DISCOUNT_VALUE");
    }

    if (data.endDate <= data.startDate) {
        throw new Error("INVALID_DATE_RANGE");
    }

    return await db.transaction(async (tx) => {
        return await insertPromotion(
            {
                name: data.name,
                discountType: data.discountType,
                discountValue: data.discountValue,
                startDate: data.startDate,
                endDate: data.endDate,
                isActive: data.isActive ?? true,
                categoryId: data.categoryId || null,
                liquorId: data.liquorId || null,
                variantId: data.variantId || null,
            },
            tx
        );
    });
};

export const updatePromotionService = async (id: string, data: UpdatePromotionDTO) => {
    const existing = await fetchPromotionById(id);
    if (!existing) {
        throw new Error("PROMOTION_NOT_FOUND");
    }

    if (data.categoryId !== undefined || data.liquorId !== undefined || data.variantId !== undefined) {
        validatePromotionTarget(
            data.categoryId ?? existing.categoryId,
            data.liquorId ?? existing.liquorId,
            data.variantId ?? existing.variantId
        );
    }

    if (data.discountType === "percentage" && data.discountValue !== undefined) {
        if (data.discountValue < 0 || data.discountValue > 100) {
            throw new Error("INVALID_PERCENTAGE");
        }
    }

    if (data.discountValue !== undefined && data.discountValue < 0) {
        throw new Error("INVALID_DISCOUNT_VALUE");
    }

    if (data.startDate !== undefined && data.endDate !== undefined) {
        if (data.endDate <= data.startDate) {
            throw new Error("INVALID_DATE_RANGE");
        }
    }

    return await db.transaction(async (tx) => {
        return await updatePromotionById(
            id,
            {
                ...(data.name !== undefined && { name: data.name }),
                ...(data.discountType !== undefined && { discountType: data.discountType }),
                ...(data.discountValue !== undefined && { discountValue: data.discountValue }),
                ...(data.startDate !== undefined && { startDate: data.startDate }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
                ...(data.isActive !== undefined && { isActive: data.isActive }),
                ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
                ...(data.liquorId !== undefined && { liquorId: data.liquorId }),
                ...(data.variantId !== undefined && { variantId: data.variantId }),
            },
            tx
        );
    });
};

export const deletePromotionService = async (id: string) => {
    const deleted = await softDeletePromotionById(id);
    if (!deleted) {
        throw new Error("PROMOTION_NOT_FOUND");
    }
    return deleted;
};
