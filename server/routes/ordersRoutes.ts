import { Router } from "express";
import { createOrder, getMyOrders, getOrderById, updateOrderStatus, getAllOrders, getAdminOrderById } from "../controllers/orderController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", requireAuth, createOrder);
router.get("/my-orders", requireAuth, getMyOrders);
router.get("/:id", requireAuth, getOrderById);

router.use(requireAuth, requireRole(["admin"]));
router.get("/admin", getAllOrders);
router.get("/admin/:id", getAdminOrderById);
router.patch("/admin/:id/status", updateOrderStatus);

export default router;
