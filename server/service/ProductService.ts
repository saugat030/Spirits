import db from "../config/dbConnect.js";
import {
    softDeleteLiquorById,
    fetchProductsWithFilters,
    getProductById,
    insertProduct,
    updateLiquorById,
    getVariantsByProductId,
    insertVariant,
    updateVariantById,
    softDeleteVariantById,
    checkProductExists,
} from "../db/repository/product.repo.js";
import type { NewLiquor, NewLiquorVariant } from "../db/schema/index.js";
import type { Image, ProductFilters, AddProductDTO, UpdateProductDTO, AddVariantDTO, UpdateVariantDTO } from "../types/types.js";
import { getPresignedImageUrl, uploadToB2 } from "../utils/s3bucket.js";
import { generateSKU } from "../utils/sku.js";

const transformVariantUrls = async (variant: any) => {
    let signedVariantImage = null;
    if (variant.variantImage) {
        signedVariantImage = {
            ...variant.variantImage,
            url: await getPresignedImageUrl(variant.variantImage.url),
        };
    }
    return { ...variant, variantImage: signedVariantImage };
};

const transformProductUrls = async (product: any) => {
    const signedThumbnailUrl = await getPresignedImageUrl(product.thumbnail_url);
    const signedImages = await Promise.all(
        (product.images || []).map(async (img: Image) => ({
            ...img,
            url: await getPresignedImageUrl(img.url),
        }))
    );

    const transformedVariants = await Promise.all(
        (product.variants || []).map(transformVariantUrls)
    );

    return {
        ...product,
        thumbnail_url: signedThumbnailUrl,
        images: signedImages,
        variants: transformedVariants,
    };
};

export const getSpiritsService = async (filters: ProductFilters, page: number) => {
    const { data, total } = await fetchProductsWithFilters(filters);

    const dataWithUrls = await Promise.all(data.map(transformProductUrls));

    const totalPages = Math.ceil(total / filters.limit);

    return {
        data: dataWithUrls,
        page,
        limit: filters.limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
    };
};

export const getSpiritByIdService = async (id: string) => {
    const product = await getProductById(id);
    if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
    }
    return transformProductUrls(product);
};

export const addProductService = async (data: AddProductDTO) => {
    return await db.transaction(async (tx) => {
        const newProduct = await insertProduct(
            {
                name: data.name,
                categoryId: data.categoryId,
                thumbnail_url: data.thumbnail_url,
                images: data.images,
                description: data.description,
            },
            tx
        );
        return newProduct;
    });
};

export const updateProductService = async (id: string, data: UpdateProductDTO) => {
    return await db.transaction(async (tx) => {
        const updateData: Partial<NewLiquor> = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.thumbnail_url !== undefined && { thumbnail_url: data.thumbnail_url }),
            ...(data.images !== undefined && { images: data.images }),
            ...(data.description !== undefined && { description: data.description }),
        };

        const updatedProduct = await updateLiquorById(id, updateData, tx);
        if (!updatedProduct) {
            throw new Error("PRODUCT_NOT_FOUND");
        }
        return updatedProduct;
    });
};

export const deleteProductService = async (id: string) => {
    const deletedProduct = await softDeleteLiquorById(id);
    if (!deletedProduct) {
        throw new Error("PRODUCT_NOT_FOUND");
    }
    return deletedProduct;
};

export const getVariantsService = async (productId: string) => {
    const productExists = await checkProductExists(productId);
    if (!productExists) {
        throw new Error("PRODUCT_NOT_FOUND");
    }

    const variants = await getVariantsByProductId(productId);
    const transformedVariants = await Promise.all(variants.map(transformVariantUrls));
    return transformedVariants;
};

export const addVariantService = async (productId: string, productName: string, data: AddVariantDTO) => {
    const productExists = await checkProductExists(productId);
    if (!productExists) {
        throw new Error("PRODUCT_NOT_FOUND");
    }

    const sku = generateSKU(productName, data.size);

    return await db.transaction(async (tx) => {
        const newVariant = await insertVariant(
            {
                liquorId: productId,
                size: data.size,
                sku,
                price: data.price,
                inventoryQuantity: data.inventoryQuantity,
                variantImage: data.variantImage,
            },
            tx
        );
        return newVariant;
    });
};

export const updateVariantService = async (variantId: string, data: UpdateVariantDTO) => {
    return await db.transaction(async (tx) => {
        const updatedVariant = await updateVariantById(variantId, data, tx);
        if (!updatedVariant) {
            throw new Error("VARIANT_NOT_FOUND");
        }
        return updatedVariant;
    });
};

export const deleteVariantService = async (variantId: string) => {
    const deletedVariant = await softDeleteVariantById(variantId);
    if (!deletedVariant) {
        throw new Error("VARIANT_NOT_FOUND");
    }
    return deletedVariant;
};
