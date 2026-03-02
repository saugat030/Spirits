import express from "express";
import {
  // greetAdmin,
  getUsers,
  updateUsers,
} from "../controllers/userController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { getNetSales, getProductSalesDetails, totalProducts } from "../controllers/statsController.js";

const router = express.Router();
// /api/admin
router.use(requireAuth, requireRole(["admin"]));

router.get("/users", getUsers);
//example body: {"name":"example","email":"example@example","userRole":"admin","isVerified":true}
router.patch("/update/:id", updateUsers);
// router.get("/stats", greetAdmin); // this requires change. Send some actual stats.
// every product ko sale details in a list. Bar graph ko lagi
// sales?product_id=1.
//How much total capital earned:
router.get("/stats/sales/net", getNetSales);
//how many total products sold. Sum of quantity
router.get("/stats/sales/total", totalProducts);
router.get("/stats/sales/products", getProductSalesDetails);

export default router;
