import express from "express";
import {
  getNetSales,
  getProductSales,
} from "../controllers/statsController.js";

const router = express.Router();

// every product ko sale details in a list. Bar gra[h ko lagi
// sales?product_id=1.
// router.get("/sales");
//total kati paisa earn vo
router.get("/sales/net", getNetSales);
//total kati ota products bikyo
router.get("/sales/products", getProductSales);
export default router;
