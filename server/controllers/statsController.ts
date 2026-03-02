import { type Request, type Response } from "express";
import { getNetSalesService, getProductSalesDetailsService, getTotalProductsService } from "../service/StatsService.js";

export const getNetSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const netSales = await getNetSalesService();
    res.status(200).json({
      success: true,
      netSales: netSales
    });

  } catch (error: any) {
    console.error("Get Net Sales Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while calculating net sales."
    });
  }
};

export const totalProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const totalQuantity = await getTotalProductsService();
    res.status(200).json({
      success: true,
      totalProducts: totalQuantity,
    });

  } catch (error: any) {
    console.error("Total Products Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching total products."
    });
  }
};

export const getProductSalesDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const productSalesData = await getProductSalesDetailsService();
    res.status(200).json({
      success: true,
      data: productSalesData,
    });
  } catch (error: any) {
    console.error("Product Sales Details Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching product sales details."
    });
  }
};
