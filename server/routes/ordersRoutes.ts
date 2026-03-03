import { Router } from "express";
import { createOrder, getMyOrders, updateOrderStatus } from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/my-orders", requireAuth, getMyOrders);

router.patch("/:id/status", requireAuth, requireRole(["admin"]), updateOrderStatus);

export default router;