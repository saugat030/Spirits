import express from "express";
import { getOrderDetails } from "../controllers/ordersController.js";

const router = express.Router();

router.get("/orders", getOrderDetails);
router.post("/orders", createOrder);

export default router;
