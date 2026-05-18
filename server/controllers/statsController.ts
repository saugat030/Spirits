import { type Request, type Response } from "express";
import { 
  getNetSalesService, 
  getProductSalesDetailsService, 
  getTotalProductsService,
  getRevenueTrendsService,
  getOrderStatusDistributionService,
  getProductsPerCategoryService
} from "../service/StatsService.js";

export const getNetSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const period = req.query.period as string;
    const netSales = await getNetSalesService(period);
    res.status(200).json({
      success: true,
      netSales: netSales
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Get Net Sales Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while calculating net sales."
    });
  }
};

export const totalProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const period = req.query.period as string;
    const totalQuantity = await getTotalProductsService(period);
    res.status(200).json({
      success: true,
      totalProducts: totalQuantity,
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Total Products Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching total products."
    });
  }
};

export const getProductSalesDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const period = req.query.period as string;
    const productSalesData = await getProductSalesDetailsService(period);
    res.status(200).json({
      success: true,
      data: productSalesData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Product Sales Details Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching product sales details."
    });
  }
};

export const getRevenueTrends = async (req: Request, res: Response): Promise<void> => {
  try {
    const period = req.query.period as string;
    const trends = await getRevenueTrendsService(period);
    res.status(200).json({
      success: true,
      data: trends,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Revenue Trends Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching revenue trends."
    });
  }
};

export const getOrderStatusDistribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const period = req.query.period as string;
    const distribution = await getOrderStatusDistributionService(period);
    res.status(200).json({
      success: true,
      data: distribution,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Order Status Distribution Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching order status distribution."
    });
  }
};

export const getProductsPerCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getProductsPerCategoryService();
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Products Per Category Error:", error);
    }
    res.status(500).json({
      success: false,
      message: "Server error while fetching products per category."
    });
  }
};
