import type { Request, Response } from "express";
import {
    createCategoryService,
    deleteCategoryService,
    getCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
} from "../service/CategoryService.js";

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await getCategoriesService();
        res.status(200).json({
            success: true,
            message: data.length > 0 ? "Categories fetched successfully." : "No categories found.",
            data,
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID format.",
        });
        return;
    }

    try {
        const data = await getCategoryByIdService(id as string);
        res.status(200).json({
            success: true,
            message: `Category with the ID: ${id} fetched successfully.`,
            data,
        });
    } catch (error: any) {
        if (error.message === "CATEGORY_NOT_FOUND") {
            res.status(404).json({
                success: false,
                message: "No category found with that ID",
            });
            return;
        }

        console.error("Error fetching category by ID:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const createCategory = async (req: Request, res: Response): Promise<void> => {
    const { category_name, category_image_url } = req.body;

    if (!category_name || !category_image_url) {
        res.status(400).json({
            success: false,
            message: "You are missing some required details.",
        });
        return;
    }

    try {
        const created = await createCategoryService({
            category_name,
            category_image_url,
        });

        res.status(201).json({
            success: true,
            message: "Category created successfully.",
            data: created,
        });
    } catch (error) {
        console.error("Create Category Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while trying to create the category",
        });
    }
};

export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID format.",
        });
        return;
    }

    const { category_name, category_image_url } = req.body;

    try {
        const updated = await updateCategoryService(id as string, {
            ...(category_name !== undefined ? { category_name } : {}),
            ...(category_image_url !== undefined ? { category_image_url } : {}),
        });

        res.status(200).json({
            success: true,
            message: "Category updated successfully.",
            data: updated,
        });
    } catch (error: any) {
        if (error.message === "CATEGORY_NOT_FOUND") {
            res.status(404).json({
                success: false,
                message: `Unable to find such category with the ID: ${id}`,
            });
            return;
        }

        console.error("Update Category Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while trying to update the category",
        });
    }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id;
    if (!id) {
        res.status(400).json({
            success: false,
            message: "Invalid category ID format.",
        });
        return;
    }

    try {
        const deleted = await deleteCategoryService(id as string);

        res.status(200).json({
            success: true,
            message: "Category deleted successfully.",
            data: deleted,
        });
    } catch (error: any) {
        if (error.message === "CATEGORY_NOT_FOUND") {
            res.status(404).json({
                success: false,
                message: "Category with such ID not found to delete.",
            });
            return;
        }

        console.error("Delete Category Error:", error);
        res.status(500).json({
            success: false,
            message: "Server error while trying to delete the category.",
        });
    }
};

