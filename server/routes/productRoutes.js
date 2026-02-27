import express from "express";
import {
  getAllSpirits,
  getSpiritsById,
} from "../controllers/productController.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminController.js";
//middleware imports:
import userAuth from "../middlewares/auth.middleware.js";
import isAdmin from "../middlewares/isAdmin.js";
import retrieveTypeId from "../middlewares/retrieveTypeId.js";
const router = express.Router();

//Get all products taking params as /api/products?type=Vodka&name=Chivas&page=1&limit=8
router.get("/", getAllSpirits);
//Get a particular product by Id:
router.get("/:id", getSpiritsById);
//Get by price:
//Only accessible to admin. Admin le form ma type ko name halxa ex:"Whiskey" ani tesko equivalent type_id table ma insert garnu parxa this middleware function does that job.
router.post("/", userAuth, isAdmin, retrieveTypeId, addProduct);
//Post use garda ni hunxa tara standard is using a put req while sending params in the endpoint.
router.put("/:id", userAuth, isAdmin, retrieveTypeId, updateProduct);
router.delete("/:id", userAuth, isAdmin, deleteProduct);
export default router;
