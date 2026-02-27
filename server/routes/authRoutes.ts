import { Router } from "express";
import {
  signup,
  login,
  logout,
  isAuth,
  userData,
  refresh,
} from "../controllers/authController.js";
import {
  authLimiter,
  apiLimiter,
  refreshLimiter,
} from "../middlewares/rateLimiter.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// auth routes with rate limiting
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout);
router.post("/refresh", refreshLimiter, refresh);
// protected routes, general API rate limiting
// check if user logged in:
router.get("/isAuth", apiLimiter, requireAuth, isAuth);
router.get("/user/data", apiLimiter, requireAuth, userData);

export default router;