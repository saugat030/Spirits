import db from "../config/dbConnect.js";
import {
    deleteLiquorById,
    fetchProductsWithFilters,
    getProductById,
    insertProduct,
    updateLiquorById,
    type ProductFilters,
} from "../db/repository/product.repo.js";
import type { NewLiquor } from "../db/schema/index.js";
import type { Image } from "../types/types.js";

type AddProductDTO = {
    name: string;
    categoryId: string;
    thumbnail_url: string;
    images?: Image[];
    description?: string;
    quantity: number;
    price: number;
};

type UpdateProductDTO = Partial<AddProductDTO>;

export const getSpiritsService = async (filters: ProductFilters, page: number) => {
    const { data, total } = await fetchProductsWithFilters(filters);
    // calculate pagination logic
    const totalPages = Math.ceil(total / filters.limit);
    return {
        data,
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
    return product;
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
                quantity: data.quantity,
                price: data.price,
            },
            tx,
        );

        return newProduct;
    });
};

export const updateProductService = async (id: string, data: UpdateProductDTO) => {
    return await db.transaction(async (tx) => {
        const updateData: Partial<NewLiquor> = {
            ...(data.name !== undefined && { name: data.name }),
            ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
            ...(data.thumbnail_url !== undefined && { thumbnail_url: data.thumbnail_url }),
            ...(data.images !== undefined && { images: data.images }),
            ...(data.description !== undefined && { description: data.description }),
            ...(data.quantity !== undefined && { quantity: data.quantity }),
            ...(data.price !== undefined && { price: data.price }),
        };

        const updatedProduct = await updateLiquorById(id, updateData, tx);
        if (!updatedProduct) {
            throw new Error("PRODUCT_NOT_FOUND");
        }
        return updatedProduct;
    });
};

export const deleteProductService = async (id: string) => {
    const deletedProduct = await deleteLiquorById(id);
    if (!deletedProduct) {
        throw new Error("PRODUCT_NOT_FOUND");
    }
    return deletedProduct;
};
