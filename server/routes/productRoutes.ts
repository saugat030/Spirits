import { Router } from "express";
import {
  getAllSpirits,
  getSpiritsById,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/s3bucket.js";

const router = Router();
router.get("/", getAllSpirits);
router.get("/:id", getSpiritsById);

// protected admin routes
router.post("/", requireAuth, requireRole(["admin"]), upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), addProduct);

router.put("/:id", requireAuth, requireRole(["admin"]), upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'images', maxCount: 6 }
]), updateProduct);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteProduct);

export default router;