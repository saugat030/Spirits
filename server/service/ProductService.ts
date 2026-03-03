import db from "../config/dbConnect.js";
import { createCategory, deleteLiquorById, fetchProductsWithFilters, getCategoryByName, getProductById, insertProduct, updateLiquorById, type ProductFilters } from "../db/repository/product.repo.js";
import type { NewLiquor } from "../db/schema/index.js";
type AddProductDTO = {
    name: string;
    typeName: string;
    imageLink?: string;
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
        let typeId: string;
        const existingCategory = await getCategoryByName(data.typeName, tx);
        // if categ doesnot exist then create it
        if (existingCategory) {
            console.log("Category already exists. Skipping creation")
            typeId = existingCategory.typeId;
        } else {
            console.log("New category Detected. Creating category first.")
            typeId = await createCategory(data.typeName, tx);
        }

        const newProduct = await insertProduct({
            name: data.name,
            typeId: typeId,
            imageLink: data.imageLink,
            description: data.description,
            quantity: data.quantity,
            price: data.price,
        }, tx);

        return newProduct;
    });
};

export const updateProductService = async (id: string, data: UpdateProductDTO) => {
    return await db.transaction(async (tx) => {
        let resolvedTypeId: string | undefined;

        // only process category logic if the admin actually sent a new typeName
        if (data.typeName) {
            const existingCategory = await getCategoryByName(data.typeName, tx);
            if (existingCategory) {
                console.log("Category already exists. Skipping creation")
                resolvedTypeId = existingCategory.typeId;
            } else {
                console.log("New category Detected. Creating category first.")
                resolvedTypeId = await createCategory(data.typeName, tx);
            }
        }

        const updateData: Partial<NewLiquor> = {
            ...(data.name !== undefined && { name: data.name }),
            ...(resolvedTypeId !== undefined && { typeId: resolvedTypeId }),
            ...(data.imageLink !== undefined && { imageLink: data.imageLink }),
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