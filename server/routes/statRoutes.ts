import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { 
    getNetSales, 
    getProductSalesDetails, 
    totalProducts, 
    getRevenueTrends, 
    getOrderStatusDistribution,
    getProductsPerCategory
} from "../controllers/statsController.js";

const router = express.Router();

router.use(requireAuth, requireRole(["admin"]));

// query params: ?period=7d|30d|90d|12m|all (default: 30d)
router.get("/admin/net", getNetSales);
router.get("/admin/total", totalProducts);
router.get("/admin/product-details", getProductSalesDetails);
router.get("/admin/revenue-trends", getRevenueTrends);
router.get("/admin/order-stats", getOrderStatusDistribution);

// Does not need period filter usually as it reflects current catalog state
router.get("/admin/category-stats", getProductsPerCategory);

export default router;