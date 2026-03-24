import { eq, and, ilike, inArray, gte, lte, count, sql, isNull } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { liquors, categories, liquorVariants, type NewLiquor, type NewLiquorVariant } from "../schema/index.js";
import type { DbClient, ProductFilters } from "../../types/types.js";

export const fetchProductsWithFilters = async (filters: ProductFilters, tx: DbClient = db) => {
    const conditions = [];

    conditions.push(eq(liquors.isActive, true));

    if (filters.types && filters.types.length > 0) {
        conditions.push(inArray(categories.category_name, filters.types));
    }
    if (filters.name) {
        conditions.push(ilike(liquors.name, `%${filters.name}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const baseQuery = tx
        .select({
            id: liquors.id,
            name: liquors.name,
            thumbnail_url: liquors.thumbnail_url,
            images: liquors.images,
            description: liquors.description,
            typeId: categories.id,
            typeName: categories.category_name,
        })
        .from(liquors)
        .innerJoin(categories, eq(liquors.categoryId, categories.id))
        .where(whereClause)
        .orderBy(liquors.id);

    const products = await baseQuery;

    const allVariants = await tx
        .select({
            liquorId: liquorVariants.liquorId,
            id: liquorVariants.id,
            size: liquorVariants.size,
            sku: liquorVariants.sku,
            price: liquorVariants.price,
            inventoryQuantity: liquorVariants.inventoryQuantity,
            variantImage: liquorVariants.variantImage,
        })
        .from(liquors)
        .innerJoin(liquorVariants, eq(liquors.id, liquorVariants.liquorId))
        .where(and(eq(liquors.isActive, true), eq(liquorVariants.isActive, true)));

    const variantsMap = new Map<string, typeof allVariants>();
    for (const variant of allVariants) {
        const existing = variantsMap.get(variant.liquorId) || [];
        existing.push(variant);
        variantsMap.set(variant.liquorId, existing);
    }

    const productsWithMinPrice = products.map((product) => {
        const variants = variantsMap.get(product.id) || [];
        const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : null;
        return { ...product, variants, minPrice };
    });

    let filteredProducts = productsWithMinPrice;
    if (filters.minPrice !== null) {
        filteredProducts = filteredProducts.filter((p) => p.minPrice !== null && p.minPrice >= filters.minPrice!);
    }
    if (filters.maxPrice !== null) {
        filteredProducts = filteredProducts.filter((p) => p.minPrice !== null && p.minPrice <= filters.maxPrice!);
    }

    const total = filteredProducts.length;
    const paginatedProducts = filteredProducts.slice(filters.offset, filters.offset + filters.limit);

    return { data: paginatedProducts, total };
};

export const getProductById = async (id: string, tx: DbClient = db) => {
    const result = await tx
        .select({
            id: liquors.id,
            name: liquors.name,
            thumbnail_url: liquors.thumbnail_url,
            images: liquors.images,
            description: liquors.description,
            typeId: categories.id,
            typeName: categories.category_name,
        })
        .from(liquors)
        .innerJoin(categories, eq(liquors.categoryId, categories.id))
        .where(and(eq(liquors.id, id), eq(liquors.isActive, true)));

    if (!result[0]) return null;

    const variants = await tx
        .select({
            id: liquorVariants.id,
            size: liquorVariants.size,
            sku: liquorVariants.sku,
            price: liquorVariants.price,
            inventoryQuantity: liquorVariants.inventoryQuantity,
            variantImage: liquorVariants.variantImage,
        })
        .from(liquorVariants)
        .where(and(eq(liquorVariants.liquorId, id), eq(liquorVariants.isActive, true)));

    const minPrice = variants.length > 0 ? Math.min(...variants.map((v) => v.price)) : null;

    return { ...result[0], variants, minPrice };
};

export const getCategoryByName = async (name: string, tx: DbClient = db) => {
    const result = await tx
        .select()
        .from(categories)
        .where(ilike(categories.category_name, name));
    return result[0];
};

export const createCategory = async (name: string, categoryImageUrl: string, tx: DbClient = db) => {
    const result = await tx
        .insert(categories)
        .values({ category_name: name, category_image_url: categoryImageUrl })
        .returning({ id: categories.id });

    if (!result[0]) throw new Error("CATEGORY_NOT_CREATED");
    return result[0].id;
};

export const insertProduct = async (productData: NewLiquor, tx: DbClient = db) => {
    const result = await tx.insert(liquors).values(productData).returning();
    return result[0];
};

export const updateLiquorById = async (id: string, productData: Partial<NewLiquor>, tx: DbClient = db) => {
    const result = await tx.update(liquors).set(productData).where(eq(liquors.id, id)).returning();
    return result[0];
};

export const softDeleteLiquorById = async (id: string, tx: DbClient = db) => {
    const result = await tx
        .update(liquors)
        .set({ isActive: false })
        .where(eq(liquors.id, id))
        .returning();
    return result[0];
};

export const getVariantsByProductId = async (productId: string, tx: DbClient = db) => {
    const result = await tx
        .select({
            id: liquorVariants.id,
            liquorId: liquorVariants.liquorId,
            size: liquorVariants.size,
            sku: liquorVariants.sku,
            price: liquorVariants.price,
            inventoryQuantity: liquorVariants.inventoryQuantity,
            variantImage: liquorVariants.variantImage,
        })
        .from(liquorVariants)
        .innerJoin(liquors, eq(liquors.id, liquorVariants.liquorId))
        .where(and(eq(liquorVariants.liquorId, productId), eq(liquorVariants.isActive, true)));
    return result;
};

export const insertVariant = async (variantData: NewLiquorVariant, tx: DbClient = db) => {
    const result = await tx.insert(liquorVariants).values(variantData).returning();
    return result[0];
};

export const updateVariantById = async (id: string, variantData: Partial<NewLiquorVariant>, tx: DbClient = db) => {
    const result = await tx
        .update(liquorVariants)
        .set(variantData)
        .where(eq(liquorVariants.id, id))
        .returning();
    return result[0];
};

export const softDeleteVariantById = async (id: string, tx: DbClient = db) => {
    const result = await tx
        .update(liquorVariants)
        .set({ isActive: false })
        .where(eq(liquorVariants.id, id))
        .returning();
    return result[0];
};

export const checkProductExists = async (productId: string, tx: DbClient = db) => {
    const result = await tx
        .select({ id: liquors.id })
        .from(liquors)
        .where(and(eq(liquors.id, productId), eq(liquors.isActive, true)));
    return result[0] !== undefined;
};

export const checkVariantExists = async (variantId: string, tx: DbClient = db) => {
    const result = await tx
        .select({ id: liquorVariants.id })
        .from(liquorVariants)
        .where(and(eq(liquorVariants.id, variantId), eq(liquorVariants.isActive, true)));
    return result[0] !== undefined;
};
