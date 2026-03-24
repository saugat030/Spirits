import { eq, and, ilike, inArray, gte, lte, count } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { liquors, categories, type NewLiquor, liquorVariants, type NewLiquorVariant } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

export type ProductFilters = {
    // category names used for filtering; corresponds to `categories.category_name`
    types: string[] | null;
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    limit: number;
    offset: number;
};

export const fetchProductsWithFilters = async (filters: ProductFilters, tx: DbClient = db) => {
    const conditions = [];

    // build dynamic where clause
    if (filters.types && filters.types.length > 0) {
        // filter by category name
        conditions.push(inArray(categories.category_name, filters.types));
    }
    if (filters.name) {
        conditions.push(ilike(liquors.name, `%${filters.name}%`));
    }
    if (filters.minPrice !== null) {
        conditions.push(gte(liquors.price, filters.minPrice));
    }
    if (filters.maxPrice !== null) {
        conditions.push(lte(liquors.price, filters.maxPrice));
    }
    // if we have conditions, combine with and else pass undefined (no filter)
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [data, totalCountResult] = await Promise.all([
        tx.select({
            id: liquors.id,
            name: liquors.name,
            thumbnail_url: liquors.thumbnail_url,
            images: liquors.images,
            description: liquors.description,
            quantity: liquors.quantity,
            typeId: categories.id,
            typeName: categories.category_name,
            price: liquors.price,
        })
            .from(liquors)
            .innerJoin(categories, eq(liquors.categoryId, categories.id))
            .where(whereClause)
            .limit(filters.limit)
            .offset(filters.offset)
            .orderBy(liquors.id),

        // count
        tx.select({ total: count() })
            .from(liquors)
            .innerJoin(categories, eq(liquors.categoryId, categories.id))
            .where(whereClause)
    ]);

    return {
        data,
        total: totalCountResult[0]?.total || 0
    };
};

export const getProductById = async (id: string, tx: DbClient = db) => {
    const result = await tx.select({
        id: liquors.id,
        name: liquors.name,
        thumbnail_url: liquors.thumbnail_url,
        images: liquors.images,
        description: liquors.description,
        quantity: liquors.quantity,
        typeId: categories.id,
        typeName: categories.category_name,
        price: liquors.price,
    })
        .from(liquors)
        .innerJoin(categories, eq(liquors.categoryId, categories.id))
        .where(eq(liquors.id, id));
    return result[0];
};

export const getCategoryByName = async (name: string, tx: DbClient = db) => {
    const result = await tx
        .select()
        .from(categories)
        .where(ilike(categories.category_name, name));
    return result[0];
};

export const createCategory = async (
    name: string,
    categoryImageUrl: string,
    tx: DbClient = db
) => {
    const result = await tx.insert(categories)
        .values({ category_name: name, category_image_url: categoryImageUrl })
        .returning({ id: categories.id });

    if (!result[0]) throw new Error("CATEGORY_NOT_CREATED");
    return result[0].id;
};

export const insertProduct = async (productData: NewLiquor, tx: DbClient = db) => {
    const result = await tx.insert(liquors)
        .values(productData)
        .returning();
    return result[0];
};

export const insertVariants = async (variantsData: NewLiquorVariant[], tx: DbClient = db) => {
    const result = await tx.insert(liquorVariants)
        .values(variantsData)
        .returning();
    return result;
};

export const updateLiquorById = async (
    id: string,
    productData: Partial<NewLiquor>,
    tx: DbClient = db
) => {
    const result = await tx.update(liquors)
        .set(productData)
        .where(eq(liquors.id, id))
        .returning();

    // result[0] will be undefined if the product ID doesn't exist
    return result[0];
};

export const deleteLiquorById = async (id: string, tx: DbClient = db) => {
    const result = await tx.delete(liquors)
        .where(eq(liquors.id, id))
        .returning();
    return result[0];
};