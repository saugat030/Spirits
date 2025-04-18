import express from "express";
import {
  getAllSpirits,
  getSpiritsById,
  getSpiritsByPrice,
} from "../controllers/productController.js";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/adminController.js";
//middleware imports:
import userAuth from "../middlewares/userAuth.js";
import retrieveTypeId from "../middlewares/retrieveTypeId.js";
const router = express.Router();

//Get all products taking params as /api/products?type=Vodka&name=Chivas&page=1&limit=8
router.get("/products", getAllSpirits);
//Get a particular product by Id:
router.get("/products/:id", getSpiritsById);
//Get by price:
//example:filter/price?min=200&max=400
router.get("/filter/price", getSpiritsByPrice);
//Only accessible to admin. Admin le form ma type ko name halxa ex:"Whiskey" ani tesko equivalent type_id table ma insert garnu parxa this middleware function does that job.
router.post("/products", userAuth, retrieveTypeId, addProduct);
//Post use garda ni hunxa tara standard is using a put req while sending params in the endpoint.
router.put("/products/:id", userAuth, retrieveTypeId, updateProduct);
router.delete("/products/:id", userAuth, deleteProduct);
export default router;
