import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, getAdminOrderById } from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/my-orders", requireAuth, getMyOrders);

// admin routes need to go b4 /:id to prevent "admin" from being caught as an ID
router.get("/admin", requireAuth, requireRole(["admin"]), getAllOrders);
router.get("/admin/:id", requireAuth, requireRole(["admin"]), getAdminOrderById);
router.patch("/admin/:id/status", requireAuth, requireRole(["admin"]), updateOrderStatus);

// dynamic :id route must be last
router.get("/:id", requireAuth, getOrderById);

export default router;
