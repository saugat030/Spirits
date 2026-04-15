import { Router } from "express";
import {
  signup,
  login,
  logout,
  isAuth,
  userData,
  refresh,
  sendVerificationOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
} from "../controllers/authController.js";
import { updateProfile } from "../controllers/userController.js";
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
// true or false return garxa if auth
router.get("/isAuth", apiLimiter, requireAuth, isAuth);
router.get("/user/data", apiLimiter, requireAuth, userData);
router.post("/update-profile", apiLimiter, requireAuth, updateProfile);

// for user who want to verify accounts later 
router.post("/send-verification-otp", apiLimiter, requireAuth, sendVerificationOtp);
router.post("/verify-email", apiLimiter, requireAuth, verifyEmail);
// new password old password only. No otp requried
router.post("/change-password", apiLimiter, requireAuth, changePassword);

// password reset routes without auth
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
export default router;