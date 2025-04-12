import express from "express";
import {
  signup,
  login,
  logout,
  isAuth,
  userData,
} from "../controllers/authController.js";
import userAuth from "../middlewares/userAuth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
//isAuth check hanna we need the middleware userAuth that verifies the tokens.
router.get("/isAuth", userAuth, isAuth);
router.get("/user/data", userAuth, userData);

export default router;
