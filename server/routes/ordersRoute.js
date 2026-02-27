import express from "express";
import {
  getOrderDetails,
  createOrder,
} from "../controllers/ordersController.js";
import isAdmin from "../middlewares/isAdmin.js";
import userAuth from "../middlewares/auth.middleware.js";
const router = express.Router();
// /api/orders/getOrder
router.get("/:order_id", userAuth, isAdmin, getOrderDetails);
// /api/orders/create
router.post("/create", createOrder);

export default router;
