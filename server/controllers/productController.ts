import { type Request, type Response } from "express";
import { addProductService, deleteProductService, getSpiritByIdService, getSpiritsService, updateProductService } from "../service/ProductService.js";

export const getAllSpirits = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Number(req.query.page) || 1;
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
  const {
    name,
    categoryId,
    thumbnail_url,
    images,
    description,
    quantity,
    price,
  } = req.body;

  if (!name || !price || !categoryId || quantity === undefined) {
    res.status(400).json({
      success: false,
      message: "You are missing some required details."
    });
    return;
  }

  try {
    const newProduct = await addProductService({
      name,
      categoryId,
      thumbnail_url,
      images,
      description,
      quantity: Number(quantity),
      price: Number(price),
    });
    console.log("Product added successfully.")
    res.status(201).json({
      success: true,
      message: "Entry created successfully.",
      statistics: newProduct
    });

  } catch (error: any) {
    console.error("Add Product Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while trying to add the product",
    });
  }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id
  if (!id) {
    throw new Error("INVALID_ID_FORMAT")
  }
  const {
    name,
    categoryId,
    thumbnail_url,
    images,
    description,
    quantity,
    price,
  } = req.body;

  try {
    const updatedProduct = await updateProductService(id as string, {
      ...(name !== undefined ? { name } : {}),
      ...(categoryId !== undefined ? { categoryId } : {}),
      ...(thumbnail_url !== undefined ? { thumbnail_url } : {}),
      ...(images !== undefined ? { images } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(quantity !== undefined ? { quantity: Number(quantity) } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
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
    res.status(500).json({
      success: false,
      message: "Server error while trying to update the product",
    });
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID format."
    });
    return;
  }

  try {
    const deletedProduct = await deleteProductService(id as string);
    console.log("Product deleted")
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