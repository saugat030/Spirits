import express from "express";
import {
  getOrderDetails,
  createOrder,
} from "../controllers/ordersController.js";

const router = express.Router();

// every product ko sale details in a list. Bar gra[h ko lagi
// sales?product_id=1.
router.get("/sales");
//total kati paisa earn vo
router.get("/sales/net");
//total kati ota products bikyo
router.get("/sales/products");
