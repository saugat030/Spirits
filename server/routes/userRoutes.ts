import { Router } from "express";
import {
  getUsers,
  updateUsers,
  updateProfile,
  softDeleteUser,
  hardDeleteUser,
} from "../controllers/userController.js";
import { userData } from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { apiLimiter } from "../middlewares/rateLimiter.js";

const router = Router();

// user profile routes
router.get("/profile", apiLimiter, requireAuth, userData);
router.patch("/profile", apiLimiter, requireAuth, updateProfile);

// admin user management routes
router.get("/admin", apiLimiter, requireAuth, requireRole(["admin"]), getUsers);
router.patch(
  "/admin/:id",
  apiLimiter,
  requireAuth,
  requireRole(["admin"]),
  updateUsers
);
router.delete(
  "/admin/:id",
  apiLimiter,
  requireAuth,
  requireRole(["admin"]),
  softDeleteUser
);
// requires is_active to be true to delete
router.delete(
  "/admin/:id/hard",
  apiLimiter,
  requireAuth,
  requireRole(["admin"]),
  hardDeleteUser
);

export default router;