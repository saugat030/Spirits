import express from "express";
import {
  getOrderDetails,
  createOrder,
} from "../controllers/ordersController.js";

const router = express.Router();
// /api/orders/getOrder
router.get("/getOrder", getOrderDetails);
// /api/orders/create
router.post("/create", createOrder);

export default router;
