import { Router } from "express";
import {
  getUsers,
  updateUsers,
  updateProfile,
} from "../controllers/userController.js";
import { userData } from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// user profile routes
router.get("/profile", apiLimiter, requireAuth, userData);
router.patch("/profile", apiLimiter, requireAuth, updateProfile);

// admin user management routes
router.get("/admin/users", apiLimiter, requireAuth, requireRole(["admin"]), getUsers);
router.patch(
  "/admin/update/:id",
  apiLimiter,
  requireAuth,
  requireRole(["admin"]),
  updateUsers
);

export default router;