import { eq, and, ilike, inArray, gte, lte, count } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { liquors, categories, type NewLiquor } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

export type ProductFilters = {
    types: string[] | null;
    name: string | null;
    minPrice: number | null;
    maxPrice: number | null;
    limit: number;
    offset: number;
};
export type NewProductInput = {
    name: string;
    typeId: number;
    imageLink?: string;
    description?: string;
    quantity: number;
    price: number;
};

export const fetchProductsWithFilters = async (filters: ProductFilters, tx: DbClient = db) => {
    const conditions = [];

    // build dynamic where clause
    if (filters.types && filters.types.length > 0) {
        conditions.push(inArray(categories.typeName, filters.types));
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
        // data query
        tx.select({
            id: liquors.id,
            name: liquors.name,
            imageLink: liquors.imageLink,
            description: liquors.description,
            quantity: liquors.quantity,
            typeId: categories.typeId,
            typeName: categories.typeName,
            price: liquors.price,
        })
            .from(liquors)
            .innerJoin(categories, eq(liquors.typeId, categories.typeId))
            .where(whereClause)
            .limit(filters.limit)
            .offset(filters.offset)
            .orderBy(liquors.id),

        // count
        tx.select({ total: count() })
            .from(liquors)
            .innerJoin(categories, eq(liquors.typeId, categories.typeId))
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
        imageLink: liquors.imageLink,
        description: liquors.description,
        quantity: liquors.quantity,
        typeId: categories.typeId,
        typeName: categories.typeName,
        price: liquors.price,
    })
        .from(liquors)
        .innerJoin(categories, eq(liquors.typeId, categories.typeId))
        .where(eq(liquors.id, id));

    return result[0];
};

export const getCategoryByName = async (name: string, tx: DbClient = db) => {
    const result = await tx.select().from(categories).where(ilike(categories.typeName, name));
    return result[0];
};

export const createCategory = async (name: string, tx: DbClient = db) => {
    const result = await tx.insert(categories)
        .values({ typeName: name })
        .returning({ typeId: categories.typeId });

    if (!result[0]) throw new Error("CATEGORY_NOT_CREATED");
    return result[0].typeId;
};

export const insertProduct = async (productData: NewLiquor, tx: DbClient = db) => {
    const result = await tx.insert(liquors)
        .values(productData)
        .returning();
    return result[0];
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