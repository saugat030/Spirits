import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { getNetSales, getProductSalesDetails, totalProducts } from "../controllers/statsController.js";

const router = express.Router();

router.use(requireAuth, requireRole(["admin"]));
//How much total capital earned:
router.get("/stats/sales/net", getNetSales);
//how many total products sold. Sum of quantity
router.get("/stats/sales/total", totalProducts);
router.get("/stats/sales/products", getProductSalesDetails);

export default router;