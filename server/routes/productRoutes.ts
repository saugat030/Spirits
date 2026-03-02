import { Router } from "express";
import {
  getAllSpirits,
  getSpiritsById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = Router();
// supports query params: ?type=Vodka&name=Chivas&page=1&limit=8
router.get("/", getAllSpirits);
router.get("/:id", getSpiritsById);

// protected Admin Routes
router.post("/", requireAuth, requireRole(["admin"]), addProduct);
router.put("/:id", requireAuth, requireRole(["admin"]), updateProduct);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteProduct);

export default router;