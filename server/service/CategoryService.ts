import db from "../config/dbConnect.js";
import {
    createCategory,
    deleteCategoryById,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
} from "../db/repository/category.repo.js";
import type { NewCategory } from "../db/schema/index.js";

type CreateCategoryDTO = {
    category_name: string;
    category_image_url: string;
};

type UpdateCategoryDTO = Partial<CreateCategoryDTO>;

export const getCategoriesService = async () => {
    return await getAllCategories();
};

export const getCategoryByIdService = async (id: string) => {
    const category = await getCategoryById(id);
    if (!category) {
        throw new Error("CATEGORY_NOT_FOUND");
    }
    return category;
};

export const createCategoryService = async (data: CreateCategoryDTO) => {
    return await db.transaction(async (tx) => {
        const payload: NewCategory = {
            category_name: data.category_name,
            category_image_url: data.category_image_url,
        };

        const created = await createCategory(payload, tx);
        return created;
    });
};

export const updateCategoryService = async (id: string, data: UpdateCategoryDTO) => {
    return await db.transaction(async (tx) => {
        const updateData: Partial<NewCategory> = {
            ...(data.category_name !== undefined && { category_name: data.category_name }),
            ...(data.category_image_url !== undefined && { category_image_url: data.category_image_url }),
        };

        const updated = await updateCategoryById(id, updateData, tx);
        if (!updated) {
            throw new Error("CATEGORY_NOT_FOUND");
        }
        return updated;
    });
};

export const deleteCategoryService = async (id: string) => {
    const deleted = await deleteCategoryById(id);
    if (!deleted) {
        throw new Error("CATEGORY_NOT_FOUND");
    }
    return deleted;
};

