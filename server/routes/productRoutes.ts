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

router.post("/admin", requireAuth, requireRole(["admin"]), uploadProductFields, addProduct);
router.put("/admin/:id", requireAuth, requireRole(["admin"]), uploadProductFields, updateProduct);
router.delete("/admin/:id", requireAuth, requireRole(["admin"]), deleteProduct);

router.get("/:productId/variants", getProductVariants);
// multipart form data use is better here even though you update only one field like size that doesnot involve image to be uploaded.
router.post("/admin/:productId/variants", requireAuth, requireRole(["admin"]), uploadVariantFields, addVariant);
router.put("/admin/variants/:variantId", requireAuth, requireRole(["admin"]), uploadVariantFields, updateVariant);
router.delete("/admin/variants/:variantId", requireAuth, requireRole(["admin"]), deleteVariant);


export default router;
