import express from "express";
import userAuth from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import { greetAdmin, getUsers } from "../controllers/adminController.js";

const router = express.Router();
// /api/admin/dashboard
router.get("/dashboard", userAuth, isAdmin, greetAdmin);
router.get("/get-users", userAuth, isAdmin, getUsers);

export default router;
