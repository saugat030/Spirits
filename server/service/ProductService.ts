import db from "../config/dbConnect.js";
import { createCategory, deleteLiquorById, fetchProductsWithFilters, getCategoryByName, getProductById, insertProduct, updateLiquorById, type ProductFilters } from "../db/repository/product.repo.js";
type AddProductDTO = {
    name: string;
    typeName: string;
    imageLink?: string;
    description?: string;
    quantity: number;
    price: number;
};
type UpdateProductDTO = Pick<AddProductDTO, "name"> &
    Partial<Omit<AddProductDTO, "name">>;

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
            typeId = existingCategory.typeId;
        } else {
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
                resolvedTypeId = existingCategory.typeId;
            } else {
                resolvedTypeId = await createCategory(data.typeName, tx);
            }
        }
        // drizzle le all undefined fields ignore hanxa so saef
        const updatedProduct = await updateLiquorById(id, {
            name: data.name,
            typeId: resolvedTypeId,
            imageLink: data.imageLink,
            description: data.description,
            quantity: data.quantity,
            price: data.price,
        }, tx);

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