import { eq, and, ilike, inArray, or, isNull, lte, gte, sql } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { liquors, categories, liquorVariants, promotions, type NewLiquor, type NewLiquorVariant } from "../schema/index.js";
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
            categoryId: categories.id,
            categoryName: categories.category_name,
        })
        .from(liquors)
        .innerJoin(categories, eq(liquors.categoryId, categories.id))
        .where(whereClause)
        .orderBy(liquors.id);

    const products = await baseQuery;

    const now = new Date();

    const allVariantsWithPromotions = await tx
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

    const allPromotions = await tx
        .select({
            id: promotions.id,
            name: promotions.name,
            discountType: promotions.discountType,
            discountValue: promotions.discountValue,
            startDate: promotions.startDate,
            endDate: promotions.endDate,
            categoryId: promotions.categoryId,
            liquorId: promotions.liquorId,
            variantId: promotions.variantId,
        })
        .from(promotions)
        .where(and(eq(promotions.isActive, true), lte(promotions.startDate, now), gte(promotions.endDate, now)));

    const variantsMap = new Map<string, typeof allVariantsWithPromotions>();
    for (const variant of allVariantsWithPromotions) {
        const existing = variantsMap.get(variant.liquorId) || [];
        existing.push(variant);
        variantsMap.set(variant.liquorId, existing);
    }

    const promotionsMap = new Map<string, typeof allPromotions>();
    for (const promo of allPromotions) {
        if (promo.variantId) {
            const existing = promotionsMap.get(`variant:${promo.variantId}`) || [];
            existing.push(promo);
            promotionsMap.set(`variant:${promo.variantId}`, existing);
        }
        if (promo.liquorId) {
            const existing = promotionsMap.get(`liquor:${promo.liquorId}`) || [];
            existing.push(promo);
            promotionsMap.set(`liquor:${promo.liquorId}`, existing);
        }
        if (promo.categoryId) {
            const existing = promotionsMap.get(`category:${promo.categoryId}`) || [];
            existing.push(promo);
            promotionsMap.set(`category:${promo.categoryId}`, existing);
        }
    }

    const productsWithVariants = products.map((product) => {
        const variants = (variantsMap.get(product.id) || []).map((variant) => {
            const variantPromos = [
                ...(promotionsMap.get(`variant:${variant.id}`) || []),
                ...(promotionsMap.get(`liquor:${product.id}`) || []),
                ...(promotionsMap.get(`category:${product.categoryId}`) || []),
            ];

            return {
                ...variant,
                promotions: variantPromos.map((p) => ({
                    id: p.id,
                    name: p.name,
                    discountType: p.discountType,
                    discountValue: p.discountValue,
                    endDate: p.endDate,
                })),
            };
        });
        return { ...product, variants };
    });

    const productsWithDiscountedPrices = productsWithVariants.map((product) => {
        const variantsWithDiscount = product.variants.map((variant) => {
            let discountedPrice = variant.price;

            if (variant.promotions.length > 0) {
                const highestDiscount = variant.promotions.reduce((max, promo) =>
                    promo.discountValue > max.discountValue ? promo : max
                );

                if (highestDiscount.discountType === "percentage") {
                    discountedPrice = Math.round(variant.price * (1 - highestDiscount.discountValue / 100));
                } else {
                    discountedPrice = Math.max(0, variant.price - highestDiscount.discountValue);
                }
            }

            return { ...variant, discountedPrice };
        });

        return { ...product, variants: variantsWithDiscount };
    });

    const productsWithMinDiscountedPrice = productsWithDiscountedPrices.map((product) => {
        const minDiscountedPrice =
            product.variants.length > 0
                ? Math.min(...product.variants.map((v) => v.discountedPrice))
                : null;
        return { ...product, minDiscountedPrice };
    });

    let filteredProducts = productsWithMinDiscountedPrice;
    if (filters.minPrice !== null) {
        filteredProducts = filteredProducts.filter(
            (p) => p.minDiscountedPrice !== null && p.minDiscountedPrice >= filters.minPrice!
        );
    }
    if (filters.maxPrice !== null) {
        filteredProducts = filteredProducts.filter(
            (p) => p.minDiscountedPrice !== null && p.minDiscountedPrice <= filters.maxPrice!
        );
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
            categoryId: categories.id,
            categoryName: categories.category_name,
        })
        .from(liquors)
        .innerJoin(categories, eq(liquors.categoryId, categories.id))
        .where(and(eq(liquors.id, id), eq(liquors.isActive, true)));

    if (!result[0]) return null;

    const product = result[0];
    const now = new Date();

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

    const allPromotions = await tx
        .select({
            id: promotions.id,
            name: promotions.name,
            discountType: promotions.discountType,
            discountValue: promotions.discountValue,
            startDate: promotions.startDate,
            endDate: promotions.endDate,
            categoryId: promotions.categoryId,
            liquorId: promotions.liquorId,
            variantId: promotions.variantId,
        })
        .from(promotions)
        .where(and(eq(promotions.isActive, true), lte(promotions.startDate, now), gte(promotions.endDate, now)));

    const variantsWithPromotions = variants.map((variant) => {
        const variantPromos = allPromotions.filter(
            (p) =>
                p.variantId === variant.id ||
                p.liquorId === product.id ||
                p.categoryId === product.categoryId
        );

        let discountedPrice = variant.price;
        if (variantPromos.length > 0) {
            const highestDiscount = variantPromos.reduce((max, promo) =>
                promo.discountValue > max.discountValue ? promo : max
            );

            if (highestDiscount.discountType === "percentage") {
                discountedPrice = Math.round(variant.price * (1 - highestDiscount.discountValue / 100));
            } else {
                discountedPrice = Math.max(0, variant.price - highestDiscount.discountValue);
            }
        }

        return {
            ...variant,
            discountedPrice,
            promotions: variantPromos.map((p) => ({
                id: p.id,
                name: p.name,
                discountType: p.discountType,
                discountValue: p.discountValue,
                endDate: p.endDate,
            })),
        };
    });

    return { ...product, variants: variantsWithPromotions };
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

export const getVariantById = async (id: string, tx: DbClient = db) => {
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
        .where(and(eq(liquorVariants.id, id), eq(liquorVariants.isActive, true)));
    return result[0];
};

export const decrementVariantInventory = async (id: string, quantity: number, tx: DbClient = db) => {
    const result = await tx
        .update(liquorVariants)
        .set({ inventoryQuantity: sql`${liquorVariants.inventoryQuantity} - ${quantity}` })
        .where(eq(liquorVariants.id, id))
        .returning();
    return result[0];
};

export const incrementVariantInventory = async (id: string, quantity: number, tx: DbClient = db) => {
    const result = await tx
        .update(liquorVariants)
        .set({ inventoryQuantity: sql`${liquorVariants.inventoryQuantity} + ${quantity}` })
        .where(eq(liquorVariants.id, id))
        .returning();
    return result[0];
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
