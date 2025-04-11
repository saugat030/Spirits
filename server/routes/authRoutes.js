import express from "express";
import {
  signup,
  login,
  logout,
  isAuth,
} from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/isAuth", userAuth, isAuth);

export default router;
