import express from "express";
import {
  getNetSales,
  totalProducts,
  getProductSalesDetails,
} from "../controllers/statsController.js";
import userAuth from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.js";
const router = express.Router();

// every product ko sale details in a list. Bar gra[h ko lagi
// sales?product_id=1.
// router.get("/sales");
//How much total capital earned:
router.get("/sales/net", userAuth, isAdmin, getNetSales);
//How many total products sold. Quantity ko sum.
router.get("/sales/total", userAuth, isAdmin, totalProducts);
router.get("/sales/products", getProductSalesDetails);
export default router;
