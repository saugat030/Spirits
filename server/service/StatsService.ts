import { fetchNetSales, fetchProductSalesDetails } from "../db/repository/stats.repo.js";
import { fetchTotalProductsSold } from "../db/repository/stats.repo.js";

export const getNetSalesService = async () => {
    const total = await fetchNetSales();
    // return 0 if no orders
    return total;
};

export const getTotalProductsService = async () => {
    const total = await fetchTotalProductsSold();
    return total;
};

export const getProductSalesDetailsService = async () => {
    const productStats = await fetchProductSalesDetails();
    return productStats;
};