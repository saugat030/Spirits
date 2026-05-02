import { Router } from "express";
import {
  localSignup,
  localLogin,
  logout,
  isAuth,
  refresh,
  sendVerificationOtp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  googleLogin,
} from "../controllers/authController.js";
import {
  authLimiter,
  apiLimiter,
  refreshLimiter,
} from "../middlewares/rateLimiter.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validateLocalSignup } from "../middlewares/validateLocalSignup.js";

const router = Router();
// auth routes with rate limiting
router.post("/signup",authLimiter, validateLocalSignup, localSignup);
router.post("/login", authLimiter, localLogin);
router.post("/google", authLimiter, googleLogin);

router.post("/logout", logout);
router.post("/refresh", refreshLimiter, refresh);
// true or false return garxa if auth
router.get("/is-auth", apiLimiter, requireAuth, isAuth);

// for user who want to verify accounts later 
router.post("/send-verification-otp", apiLimiter, requireAuth, sendVerificationOtp);
router.post("/verify-email", apiLimiter, requireAuth, verifyEmail);

// new password old password only. No otp requried
router.post("/change-password", apiLimiter, requireAuth, changePassword);

// password reset routes without auth
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
export default router;