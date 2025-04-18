import express from "express";
import userAuth from "../middlewares/userAuth.js";
import { greetAdmin } from "../controllers/adminController.js";

const router = express.Router();

router.get("/admin/dashboard", userAuth, greetAdmin);

export default router;
