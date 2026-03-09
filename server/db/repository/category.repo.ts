import { eq } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { categories, type NewCategory } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

export const getAllCategories = async (tx: DbClient = db) => {
    const result = await tx.select().from(categories);
    return result;
};

export const getCategoryById = async (id: string, tx: DbClient = db) => {
    const result = await tx
        .select()
        .from(categories)
        .where(eq(categories.id, id));

    return result[0];
};

export const createCategory = async (data: NewCategory, tx: DbClient = db) => {
    const result = await tx
        .insert(categories)
        .values(data)
        .returning();

    return result[0];
};

export const updateCategoryById = async (
    id: string,
    data: Partial<NewCategory>,
    tx: DbClient = db,
) => {
    const result = await tx
        .update(categories)
        .set(data)
        .where(eq(categories.id, id))
        .returning();

    return result[0];
};

export const deleteCategoryById = async (id: string, tx: DbClient = db) => {
    const result = await tx
        .delete(categories)
        .where(eq(categories.id, id))
        .returning();

    return result[0];
};

