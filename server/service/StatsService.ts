import { fetchNetSales, fetchProductSalesDetails, fetchRevenueTrends, fetchOrderStatusDistribution, fetchProductsPerCategory } from "../db/repository/stats.repo.js";
import { fetchTotalProductsSold } from "../db/repository/stats.repo.js";

export const getNetSalesService = async (period?: string) => {
    const total = await fetchNetSales(period);
    // return 0 if no orders
    return total;
};

export const getTotalProductsService = async (period?: string) => {
    const total = await fetchTotalProductsSold(period);
    return total;
};

export const getProductSalesDetailsService = async (period?: string) => {
    const productStats = await fetchProductSalesDetails(period);
    return productStats;
};

export const getRevenueTrendsService = async (period?: string) => {
    const trends = await fetchRevenueTrends(period);
    return trends;
};

export const getOrderStatusDistributionService = async (period?: string) => {
    const distribution = await fetchOrderStatusDistribution(period);
    return distribution;
};

export const getProductsPerCategoryService = async () => {
    const categoriesStats = await fetchProductsPerCategory();
    return categoriesStats;
};