import { type Request, type Response } from "express";
import {
    getAllPromotionsService,
    getActivePromotionsService,
    getPromotionByIdService,
    createPromotionService,
    updatePromotionService,
    deletePromotionService,
} from "../service/PromotionService.js";

export const getAllPromotions = async (req: Request, res: Response): Promise<void> => {
    try {
        const promotions = await getAllPromotionsService();
        res.status(200).json({ success: true, data: promotions });
    } catch (error) {
        console.error("Error fetching promotions:", error);
        res.status(500).json({ success: false, message: "Server error fetching promotions." });
    }
};

export const getActivePromotions = async (req: Request, res: Response): Promise<void> => {
    try {
        const promotions = await getActivePromotionsService();
        res.status(200).json({ success: true, data: promotions });
    } catch (error) {
        console.error("Error fetching active promotions:", error);
        res.status(500).json({ success: false, message: "Server error fetching promotions." });
    }
};

export const getPromotionById = async (req: Request, res: Response): Promise<void> => {
    try {
        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam || "";
        if (!id) {
            res.status(400).json({ success: false, message: "Invalid promotion ID." });
            return;
        }
        const promotion = await getPromotionByIdService(id);
        res.status(200).json({ success: true, data: promotion });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "PROMOTION_NOT_FOUND") {
            res.status(404).json({ success: false, message: "Promotion not found." });
            return;
        }
        console.error("Error fetching promotion:", error);
        res.status(500).json({ success: false, message: "Server error fetching promotion." });
    }
};

export const createPromotion = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, discountType, discountValue, startDate, endDate, isActive, categoryId, liquorId, variantId } = req.body;

        if (!name) {
            res.status(400).json({ success: false, message: "Promotion name is required." });
            return;
        }
        if (!discountType || !["percentage", "fixed_amount"].includes(discountType)) {
            res.status(400).json({ success: false, message: "Invalid discount type. Must be 'percentage' or 'fixed_amount'." });
            return;
        }
        if (discountValue === undefined || discountValue === null) {
            res.status(400).json({ success: false, message: "Discount value is required." });
            return;
        }
        if (!startDate || !endDate) {
            res.status(400).json({ success: false, message: "Start date and end date are required." });
            return;
        }

        const promotion = await createPromotionService({
            name,
            discountType,
            discountValue,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            isActive,
            categoryId,
            liquorId,
            variantId,
        });

        res.status(201).json({ success: true, message: "Promotion created successfully.", data: promotion });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === "PROMOTION_TARGET_REQUIRED") {
                res.status(400).json({ success: false, message: "Promotion must target at least one item (category, product, or variant)." });
                return;
            }
            if (error.message === "PROMOTION_ONLY_ONE_TARGET") {
                res.status(400).json({ success: false, message: "Promotion can only target one item (category, product, or variant)." });
                return;
            }
            if (error.message === "INVALID_PERCENTAGE") {
                res.status(400).json({ success: false, message: "Percentage discount must be between 0 and 100." });
                return;
            }
            if (error.message === "INVALID_DISCOUNT_VALUE") {
                res.status(400).json({ success: false, message: "Discount value must be a positive number." });
                return;
            }
            if (error.message === "INVALID_DATE_RANGE") {
                res.status(400).json({ success: false, message: "End date must be after start date." });
                return;
            }
        }
        console.error("Error creating promotion:", error);
        res.status(500).json({ success: false, message: "Server error creating promotion." });
    }
};

export const updatePromotion = async (req: Request, res: Response): Promise<void> => {
    try {
        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam || "";
        if (!id) {
            res.status(400).json({ success: false, message: "Invalid promotion ID." });
            return;
        }

        const { name, discountType, discountValue, startDate, endDate, isActive, categoryId, liquorId, variantId } = req.body;

        if (discountType && !["percentage", "fixed_amount"].includes(discountType)) {
            res.status(400).json({ success: false, message: "Invalid discount type. Must be 'percentage' or 'fixed_amount'." });
            return;
        }

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (discountType !== undefined) updateData.discountType = discountType;
        if (discountValue !== undefined) updateData.discountValue = discountValue;
        if (startDate !== undefined) updateData.startDate = new Date(startDate);
        if (endDate !== undefined) updateData.endDate = new Date(endDate);
        if (isActive !== undefined) updateData.isActive = isActive;
        if (categoryId !== undefined) updateData.categoryId = categoryId || null;
        if (liquorId !== undefined) updateData.liquorId = liquorId || null;
        if (variantId !== undefined) updateData.variantId = variantId || null;

        const promotion = await updatePromotionService(id, updateData);

        res.status(200).json({ success: true, message: "Promotion updated successfully.", data: promotion });
    } catch (error: unknown) {
        if (error instanceof Error) {
            if (error.message === "PROMOTION_NOT_FOUND") {
                res.status(404).json({ success: false, message: "Promotion not found." });
                return;
            }
            if (error.message === "PROMOTION_TARGET_REQUIRED") {
                res.status(400).json({ success: false, message: "Promotion must target at least one item (category, product, or variant)." });
                return;
            }
            if (error.message === "PROMOTION_ONLY_ONE_TARGET") {
                res.status(400).json({ success: false, message: "Promotion can only target one item (category, product, or variant)." });
                return;
            }
            if (error.message === "INVALID_PERCENTAGE") {
                res.status(400).json({ success: false, message: "Percentage discount must be between 0 and 100." });
                return;
            }
            if (error.message === "INVALID_DISCOUNT_VALUE") {
                res.status(400).json({ success: false, message: "Discount value must be a positive number." });
                return;
            }
            if (error.message === "INVALID_DATE_RANGE") {
                res.status(400).json({ success: false, message: "End date must be after start date." });
                return;
            }
        }
        console.error("Error updating promotion:", error);
        res.status(500).json({ success: false, message: "Server error updating promotion." });
    }
};

export const deletePromotion = async (req: Request, res: Response): Promise<void> => {
    try {
        const idParam = req.params.id;
        const id = Array.isArray(idParam) ? idParam[0] : idParam || "";
        if (!id) {
            res.status(400).json({ success: false, message: "Invalid promotion ID." });
            return;
        }

        await deletePromotionService(id);
        res.status(200).json({ success: true, message: "Promotion deleted successfully." });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "PROMOTION_NOT_FOUND") {
            res.status(404).json({ success: false, message: "Promotion not found." });
            return;
        }
        console.error("Error deleting promotion:", error);
        res.status(500).json({ success: false, message: "Server error deleting promotion." });
    }
};
