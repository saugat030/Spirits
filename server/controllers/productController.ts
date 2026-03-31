import { type Request, type Response } from "express";
import {
    addProductService,
    deleteProductService,
    getSpiritByIdService,
    getSpiritsService,
    updateProductService,
    getVariantsService,
    addVariantService,
    updateVariantService,
    deleteVariantService,
} from "../service/ProductService.js";
import { uploadToB2, deleteFromB2 } from "../utils/s3bucket.js";
import type { Image, ProductFilters, AddVariantDTO, UpdateVariantDTO } from "../types/types.js";

export const getAllSpirits = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Number(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const { type, name, minPrice, maxPrice } = req.query;

        const types = Array.isArray(type)
            ? (type as string[])
            : typeof type === "string" && type !== "null" && type !== ""
                ? [type]
                : null;
        const normalizedName =
            typeof name === "string" && name !== "null" && name !== "" ? name : null;
        const parsedMin = minPrice && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
        const parsedMax = maxPrice && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;

        if (parsedMin !== null && parsedMax !== null && parsedMin > parsedMax) {
            res.status(400).json({
                success: false,
                message: "Minimum price cannot be greater than maximum price",
            });
            return;
        }

        const result = await getSpiritsService(
            { types, name: normalizedName, minPrice: parsedMin, maxPrice: parsedMax, limit, offset },
            page
        );
        console.log("products fetched successfully.");
        res.status(200).json({
            success: true,
            message: result.data.length > 0 ? "Products fetched successfully" : "No products found with the applied filters",
            ...result,
        });
    } catch (err) {
        console.error("Error fetching spirits:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const getSpiritsById = async (req: Request, res: Response): Promise<void> => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;
    if (!id) {
        res.status(400).json({ success: false, message: "Invalid product ID format." });
        return;
    }
    try {
        const data = await getSpiritByIdService(id);
        res.status(200).json({
            success: true,
            message: `Product with the ID: ${id} fetched successfully.`,
            data,
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
            res.status(404).json({ success: false, message: "No products found with that ID" });
            return;
        }
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const addProduct = async (req: Request, res: Response): Promise<void> => {
    const { name, categoryId, description } = req.body;

    if (!name || !categoryId) {
        res.status(400).json({ success: false, message: "Name and categoryId are required." });
        return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const thumbnailFile = files?.["thumbnail"]?.[0];
    const imageFiles = files?.["images"] || [];

    if (!thumbnailFile) {
        res.status(400).json({ success: false, message: "A thumbnail image is required." });
        return;
    }

    let uploadedThumbnail: string | null = null;
    let uploadedImages: Image[] = [];

    try {
        uploadedThumbnail = await uploadToB2(thumbnailFile, "gallery");

        const uploadResults = await Promise.allSettled(
            imageFiles.map(async (file) => {
                const fileKey = await uploadToB2(file, "gallery");
                return { url: fileKey, alt_text: `${name} - ${file.originalname}` } as Image;
            })
        );

        for (const result of uploadResults) {
            if (result.status === "fulfilled") {
                uploadedImages.push(result.value);
            } else {
                console.error("Failed to upload an image:", result.reason);
            }
        }

        const newProduct = await addProductService({
            name,
            categoryId,
            thumbnail_url: uploadedThumbnail,
            images: uploadedImages,
            description,
        });
        console.log("Product added successfully.", newProduct);
        res.status(201).json({
            success: true,
            message: "Product created successfully.",
            data: newProduct,
        });
    } catch (error: unknown) {
        console.error("Add Product Error:", error);

        if (uploadedThumbnail) {
            await deleteFromB2(uploadedThumbnail).catch((e) => console.error("Rollback failed for thumbnail", e));
        }
        for (const img of uploadedImages) {
            await deleteFromB2(img.url).catch((e) => console.error("Rollback failed for", img.url, e));
        }

        res.status(500).json({ success: false, message: "Server error while trying to add the product" });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!id) {
        res.status(400).json({ success: false, message: "Invalid product ID format." });
        return;
    }

    const { name, description } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const thumbnailFile = files?.["thumbnail"]?.[0];
    const imageFiles = files?.["images"] || [];

    let uploadedThumbnail: string | undefined;
    let uploadedImages: Image[] | undefined;

    let existingProduct;
    try {
        existingProduct = await getSpiritByIdService(id);
    } catch (err: unknown) {
        if (err instanceof Error && err.message === "PRODUCT_NOT_FOUND") {
            res.status(404).json({ success: false, message: `Unable to find such product with the ID: ${id}` });
        } else {
            res.status(500).json({ success: false, message: "Internal server error reading existing product." });
        }
        return;
    }

    try {
        if (thumbnailFile) {
            uploadedThumbnail = await uploadToB2(thumbnailFile, "gallery");
        }

        const productName = Array.isArray(name) ? name[0] : name;
        if (imageFiles.length > 0) {
            uploadedImages = [];
            const uploadResults = await Promise.allSettled(
                imageFiles.map(async (file) => {
                    const fileKey = await uploadToB2(file, "gallery");
                    return { url: fileKey, alt_text: `${productName || existingProduct.name} - ${file.originalname}` } as Image;
                })
            );

            for (const result of uploadResults) {
                if (result.status === "fulfilled") {
                    uploadedImages.push(result.value);
                } else {
                    console.error("Failed to upload an image during update:", result.reason);
                }
            }
        }

        const updatedProduct = await updateProductService(id, {
            ...(name !== undefined && { name }),
            ...(uploadedThumbnail !== undefined && { thumbnail_url: uploadedThumbnail }),
            ...(uploadedImages !== undefined && { images: uploadedImages }),
            ...(description !== undefined && { description }),
        });

        res.status(200).json({
            success: true,
            message: "Product updated successfully.",
            data: updatedProduct,
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
            res.status(404).json({ success: false, message: `Unable to find such product with the ID: ${id}` });
            return;
        }
        if (error instanceof Error && error.message === "INVALID_ID_FORMAT") {
            res.status(400).json({ success: false, message: "Invalid product ID format." });
            return;
        }

        console.error("Update Product Error:", error);

        if (uploadedThumbnail) {
            await deleteFromB2(uploadedThumbnail).catch((e) => console.error(e));
        }
        if (uploadedImages) {
            for (const img of uploadedImages) {
                await deleteFromB2(img.url).catch((e) => console.error(e));
            }
        }

        res.status(500).json({ success: false, message: "Server error while trying to update the product" });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const idParam = req.params.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!id) {
        res.status(400).json({ success: false, message: "Invalid product ID format." });
        return;
    }

    try {
        const deletedProduct = await deleteProductService(id);

        if (deletedProduct?.thumbnail_url) {
            await deleteFromB2(deletedProduct.thumbnail_url).catch((e) => console.error("Failed to delete thumbnail from B2", e));
        }
        if (Array.isArray(deletedProduct?.images)) {
            await Promise.allSettled(
                (deletedProduct.images as Image[]).map(async (img) => {
                    if (img && img.url) {
                        await deleteFromB2(img.url);
                    }
                })
            ).catch((e) => console.error("Failed to delete some images from B2", e));
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully.",
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
            res.status(404).json({ success: false, message: "Product with such ID not found to delete." });
            return;
        }
        console.error("Delete Product Error:", error);
        res.status(500).json({ success: false, message: "Server error while trying to delete the product." });
    }
};

export const getProductVariants = async (req: Request, res: Response): Promise<void> => {
    const productIdParam = req.params.productId;
    const productId = Array.isArray(productIdParam) ? productIdParam[0] : productIdParam;
    if (!productId) {
        res.status(400).json({ success: false, message: "Invalid product ID format." });
        return;
    }
    try {
        const variants = await getVariantsService(productId);
        res.status(200).json({
            success: true,
            message: "Variants fetched successfully.",
            data: variants,
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
            res.status(404).json({ success: false, message: "No product found with that ID." });
            return;
        }
        console.error("Error fetching variants:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const addVariant = async (req: Request, res: Response): Promise<void> => {
    const productIdParam = req.params.productId;
    const productId = Array.isArray(productIdParam) ? productIdParam[0] : productIdParam;
    if (!productId) {
        res.status(400).json({ success: false, message: "Invalid product ID format." });
        return;
    }

    const { size, price, inventoryQuantity } = req.body;

    if (!size || price === undefined || price === null || inventoryQuantity === undefined || inventoryQuantity === null) {
        res.status(400).json({ success: false, message: "Size, price, and inventoryQuantity are required." });
        return;
    }

    const parsedPrice = Number(price);
    const parsedQuantity = Number(inventoryQuantity);

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
        res.status(400).json({ success: false, message: "Price must be a valid positive number." });
        return;
    }
    if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        res.status(400).json({ success: false, message: "Inventory quantity must be a valid non-negative number." });
        return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const variantImageFile = files?.["variantImage"]?.[0];

    let uploadedVariantImage: Image | undefined;

    try {
        if (variantImageFile) {
            const fileKey = await uploadToB2(variantImageFile, "variants");
            uploadedVariantImage = {
                url: fileKey,
                alt_text: `${size} variant image`,
            };
        }

        let existingProduct;
        try {
            existingProduct = await getSpiritByIdService(productId);
        } catch {
            res.status(404).json({ success: false, message: "Product not found." });
            return;
        }

        const newVariant = await addVariantService(productId, existingProduct.name, {
            size,
            price: parsedPrice,
            inventoryQuantity: parsedQuantity,
            ...(uploadedVariantImage && { variantImage: uploadedVariantImage }),
        });

        res.status(201).json({
            success: true,
            message: "Variant created successfully.",
            data: newVariant,
        });
    } catch (error: unknown) {
        console.error("Add Variant Error:", error);

        if (uploadedVariantImage) {
            await deleteFromB2(uploadedVariantImage.url).catch((e) => console.error("Rollback failed for variant image", e));
        }

        if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
            res.status(404).json({ success: false, message: "Product not found." });
            return;
        }

        res.status(500).json({ success: false, message: "Server error while trying to add the variant" });
    }
};

export const updateVariant = async (req: Request, res: Response): Promise<void> => {
    const variantIdParam = req.params.variantId;
    const variantId = Array.isArray(variantIdParam) ? variantIdParam[0] : variantIdParam;
    if (!variantId) {
        res.status(400).json({ success: false, message: "Invalid variant ID format." });
        return;
    }

    const { size, price, inventoryQuantity } = req.body;

    let parsedPrice: number | undefined;
    let parsedQuantity: number | undefined;

    if (price !== undefined && price !== null && price !== "") {
        parsedPrice = Number(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            res.status(400).json({ success: false, message: "Price must be a valid positive number." });
            return;
        }
    }

    if (inventoryQuantity !== undefined && inventoryQuantity !== null && inventoryQuantity !== "") {
        parsedQuantity = Number(inventoryQuantity);
        if (isNaN(parsedQuantity) || parsedQuantity < 0) {
            res.status(400).json({ success: false, message: "Inventory quantity must be a valid non-negative number." });
            return;
        }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const variantImageFile = files?.["variantImage"]?.[0];

    let uploadedVariantImage: Image | undefined;

    try {
        if (variantImageFile) {
            const fileKey = await uploadToB2(variantImageFile, "variants");
            uploadedVariantImage = {
                url: fileKey,
                alt_text: `${size || "variant"} variant image`,
            };
        }

        const updateData: UpdateVariantDTO = {
            ...(size !== undefined && { size }),
            ...(parsedPrice !== undefined && { price: parsedPrice }),
            ...(parsedQuantity !== undefined && { inventoryQuantity: parsedQuantity }),
            ...(uploadedVariantImage !== undefined && { variantImage: uploadedVariantImage }),
        };

        const updatedVariant = await updateVariantService(variantId, updateData);

        res.status(200).json({
            success: true,
            message: "Variant updated successfully.",
            data: updatedVariant,
        });
    } catch (error: unknown) {
        console.error("Update Variant Error:", error);

        if (uploadedVariantImage) {
            await deleteFromB2(uploadedVariantImage.url).catch((e) => console.error("Rollback failed for variant image", e));
        }

        if (error instanceof Error && error.message === "VARIANT_NOT_FOUND") {
            res.status(404).json({ success: false, message: "Variant not found." });
            return;
        }

        res.status(500).json({ success: false, message: "Server error while trying to update the variant" });
    }
};

export const deleteVariant = async (req: Request, res: Response): Promise<void> => {
    const variantIdParam = req.params.variantId;
    const variantId = Array.isArray(variantIdParam) ? variantIdParam[0] : variantIdParam;
    if (!variantId) {
        res.status(400).json({ success: false, message: "Invalid variant ID format." });
        return;
    }

    try {
        const deletedVariant = await deleteVariantService(variantId);

        if (deletedVariant?.variantImage) {
            await deleteFromB2(deletedVariant.variantImage.url).catch((e) => console.error("Failed to delete variant image from B2", e));
        }

        res.status(200).json({
            success: true,
            message: "Variant deleted successfully.",
        });
    } catch (error: unknown) {
        if (error instanceof Error && error.message === "VARIANT_NOT_FOUND") {
            res.status(404).json({ success: false, message: "Variant with such ID not found to delete." });
            return;
        }
        console.error("Delete Variant Error:", error);
        res.status(500).json({ success: false, message: "Server error while trying to delete the variant." });
    }
};
