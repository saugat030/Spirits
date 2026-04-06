import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import {
    getActivePromotions,
    getAllPromotions,
    getPromotionById,
    createPromotion,
    updatePromotion,
    deletePromotion,
} from "../controllers/promotionController.js";

const router = Router();

router.get("/", getActivePromotions);

router.use(requireAuth, requireRole(["admin"]));

router.get("/admin", getAllPromotions);
router.get("/admin/:id", getPromotionById);
router.post("/admin", createPromotion);
router.put("/admin/:id", updatePromotion);
router.delete("/admin/:id", deletePromotion);

export default router;
