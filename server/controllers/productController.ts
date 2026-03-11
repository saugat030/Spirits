import { type Request, type Response } from "express";
import { addProductService, deleteProductService, getSpiritByIdService, getSpiritsService, updateProductService } from "../service/ProductService.js";
import { uploadToB2, deleteFromB2 } from "../utils/s3bucket.js";
import type { Image } from "../types/types.js";

export const getAllSpirits = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Number(req.query.limit) || 12;
    const offset = (page - 1) * limit;
    let { type, name, minPrice, maxPrice } = req.query;
    // normalize inputs
    const types = Array.isArray(type)
      ? (type as string[])
      : (typeof type === "string" && type !== "null" && type !== "")
        ? [type]
        : null;
    const normalizedName = (typeof name === "string" && name !== "null" && name !== "")
      ? name
      : null;
    const parsedMin = minPrice && !isNaN(Number(minPrice)) ? Number(minPrice) : null;
    const parsedMax = maxPrice && !isNaN(Number(maxPrice)) ? Number(maxPrice) : null;
    // simple validations
    if (parsedMin !== null && parsedMax !== null && parsedMin > parsedMax) {
      res.status(400).json({
        success: false,
        message: "Minimum price cannot be greater than maximum price",
      });
      return;
    }

    const result = await getSpiritsService({
      types,
      name: normalizedName,
      minPrice: parsedMin,
      maxPrice: parsedMax,
      limit,
      offset,
    }, page);

    console.log("All products fetched");
    res.status(200).json({
      success: true,
      message: result.data.length > 0
        ? "Products fetched successfully"
        : "No products found with the applied filters",
      ...result,
      filters: { type: types, name: normalizedName, minPrice: parsedMin, maxPrice: parsedMax },
    });

  } catch (err) {
    console.error("Error fetching spirits:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getSpiritsById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({ success: false, message: "Invalid product ID format." });
    return;
  }
  try {
    const data = await getSpiritByIdService(id as string);
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

  const { name, categoryId, description, quantity, price } = req.body;
  if (!name || price === undefined || price === null || !categoryId || quantity === undefined || quantity === null) {
    res.status(400).json({
      success: false,
      message: "You are missing some required details."
    });
    return;
  }

  const parsedPrice = Number(price);
  const parsedQuantity = Number(quantity);

  if (isNaN(parsedPrice) || isNaN(parsedQuantity)) {
    res.status(400).json({
      success: false,
      message: "Price and quantity must be valid numbers."
    });
    return;
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const thumbnailFile = files?.['thumbnail']?.[0];
  const imageFiles = files?.['images'] || [];
  if (!thumbnailFile) {
    res.status(400).json({
      success: false,
      message: "A thumbnail image is required."
    });
    return;
  }

  let uploadedThumbnail: string | null = null;
  let uploadedImages: Image[] = [];

  try {
    uploadedThumbnail = await uploadToB2(thumbnailFile);
    
    const uploadResults = await Promise.allSettled(
      imageFiles.map(async (file) => {
        const fileKey = await uploadToB2(file);
        return {
          url: fileKey,
          alt_text: `${name} - ${file.originalname}`,
        } as Image;
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
      quantity: parsedQuantity,
      price: parsedPrice,
    });

    console.log("Product added successfully.")
    res.status(201).json({
      success: true,
      message: "Entry created successfully.",
      statistics: newProduct
    });

  } catch (error: any) {
    console.error("Add Product Error:", error);
    
    // Rollback logic
    if (uploadedThumbnail) {
      await deleteFromB2(uploadedThumbnail).catch(e => console.error("Rollback failed for thumbnail", e));
    }
    for (const img of uploadedImages) {
      await deleteFromB2(img.url).catch(e => console.error("Rollback failed for", img.url, e));
    }

    res.status(500).json({
      success: false,
      message: "Server error while trying to add the product",
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  
  if (!id) {
    res.status(400).json({ success: false, message: "Invalid product ID format." });
    return;
  }
  const {
    name,
    categoryId,
    description,
    quantity,
    price,
  } = req.body;

  let parsedPrice: number | undefined;
  let parsedQuantity: number | undefined;

  if (price !== undefined && price !== null && price !== "") {
    parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
      res.status(400).json({ success: false, message: "Price must be a valid number." });
      return;
    }
  }

  if (quantity !== undefined && quantity !== null && quantity !== "") {
    parsedQuantity = Number(quantity);
    if (isNaN(parsedQuantity)) {
      res.status(400).json({ success: false, message: "Quantity must be a valid number." });
      return;
    }
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
  const thumbnailFile = files?.['thumbnail']?.[0];
  const imageFiles = files?.['images'] || [];

  let uploadedThumbnail: string | undefined;
  let uploadedImages: Image[] | undefined;

  // Track the old product state so we can delete old images from B2
  let existingProduct;
  try {
    existingProduct = await getSpiritByIdService(id);
  } catch (err: any) {
    if (err.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({ success: false, message: `Unable to find such product with the ID: ${id}` });
    } else {
      res.status(500).json({ success: false, message: "Internal server error reading existing product." });
    }
    return;
  }

  try {
    if (thumbnailFile) {
      uploadedThumbnail = await uploadToB2(thumbnailFile);
    }

    if (imageFiles.length > 0) {
      uploadedImages = [];
      const uploadResults = await Promise.allSettled(
        imageFiles.map(async (file) => {
          const fileKey = await uploadToB2(file);
          return {
            url: fileKey,
            alt_text: `${name || existingProduct.name} - ${file.originalname}`,
          } as Image;
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
      ...(name !== undefined ? { name } : {}),
      ...(categoryId !== undefined ? { categoryId } : {}),
      ...(uploadedThumbnail ? { thumbnail_url: uploadedThumbnail } : {}),
      ...(uploadedImages ? { images: uploadedImages } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(parsedQuantity !== undefined ? { quantity: parsedQuantity } : {}),
      ...(parsedPrice !== undefined ? { price: parsedPrice } : {}),
    });

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      statistics: updatedProduct
    });

  } catch (error: any) {
    if (error.message === "INVALID_ID_FORMAT") {
      res.status(400).json({
        success: false,
        message: "Invalid product ID format."
      });
      return;
    }
    if (error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: `Unable to find such product with the ID: ${id}`
      });
      return;
    }

    console.error("Update Product Error:", error);
    
    // Rollback new uploads
    if (uploadedThumbnail) {
      await deleteFromB2(uploadedThumbnail).catch(e => console.error(e));
    }
    if (uploadedImages) {
      for (const img of uploadedImages) {
        await deleteFromB2(img.url).catch(e => console.error(e));
      }
    }

    res.status(500).json({
      success: false,
      message: "Server error while trying to update the product",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const idParam = req.params.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID format."
    });
    return;
  }

  try {
    const deletedProduct = await deleteProductService(id);
    console.log("Product deleted");

    if (deletedProduct) {
      if (deletedProduct.thumbnail_url) {
        await deleteFromB2(deletedProduct.thumbnail_url).catch(e => console.error("Failed to delete thumbnail from B2", e));
      }
      if (Array.isArray(deletedProduct.images)) {
        await Promise.allSettled(
          (deletedProduct.images as Image[]).map(async (img) => {
            if (img && img.url) {
              await deleteFromB2(img.url);
            }
          })
        ).catch(e => console.error("Failed to delete some images from B2", e));
      }
    }
    
    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
      statistics: deletedProduct,
    });

  } catch (error: any) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      res.status(404).json({
        success: false,
        message: "Product with such ID not found to delete."
      });
      return;
    }
    console.error("Delete Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while trying to delete the product."
    });
  }
};