import { Router } from "express";
import {
    getAllSpirits,
    getSpiritsById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductVariants,
    addVariant,
    updateVariant,
    deleteVariant,
} from "../controllers/productController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { uploadProductFields, uploadVariantFields } from "../utils/s3bucket.js";

const router = Router();

router.get("/", getAllSpirits);
router.get("/:id", getSpiritsById);

router.post("/", requireAuth, requireRole(["admin"]), uploadProductFields, addProduct);
router.put("/:id", requireAuth, requireRole(["admin"]), uploadProductFields, updateProduct);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteProduct);

router.get("/:productId/variants", getProductVariants);
router.post("/:productId/variants", requireAuth, requireRole(["admin"]), uploadVariantFields, addVariant);
router.put("/:productId/variants/:variantId", requireAuth, requireRole(["admin"]), uploadVariantFields, updateVariant);
router.delete("/:productId/variants/:variantId", requireAuth, requireRole(["admin"]), deleteVariant);

export default router;
