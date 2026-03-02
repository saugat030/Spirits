import express from "express";
import {
  getOrderDetails,
  createOrder,
} from "../controllers/ordersController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();
// /api/orders/getOrder
router.get("/:order_id", requireAuth, requireRole(["admin"]), getOrderDetails);
// /api/orders/create
router.post("/create", createOrder);

export default router;
