import express from "express";
import {
  getAllSpirits,
  getSpiritsById,
  getSpiritsByPrice,
} from "../controllers/productController.js";

const router = express.Router();

//Get all products taking params as /api/products?type=Vodka&name=Chivas&page=1&limit=8
router.get("/products", getAllSpirits);
//Get a particular product by Id:
router.get("/products/:id", getSpiritsById);
//Get by price:
//example:filter/price?min=200&max=400
router.get("/filter/price", getSpiritsByPrice);

export default router;
