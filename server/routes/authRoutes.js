import express from "express";
import {
  signup,
  login,
  logout,
  isAuth,
  userData,
  refresh,
} from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";
import {
  authLimiter,
  apiLimiter,
  refreshLimiter,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

// Auth routes with rate limiting
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", logout); // No rate limiting needed for logout
router.post("/refresh", refreshLimiter, refresh);
// Protected routes with general API rate limiting
router.get("/isAuth", apiLimiter, userAuth, isAuth);
router.get("/user/data", apiLimiter, userAuth, userData);

export default router;
