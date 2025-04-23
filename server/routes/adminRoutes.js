import express from "express";
import userAuth from "../middlewares/userAuth.js";
import isAdmin from "../middlewares/isAdmin.js";
import {
  greetAdmin,
  getUsers,
  updateUsers,
} from "../controllers/adminController.js";

const router = express.Router();
// /api/admin/dashboard
router.get("/dashboard", userAuth, isAdmin, greetAdmin);
router.get("/get-users", userAuth, isAdmin, getUsers);
//example body: {"name":"example","email":"example@example","userRole":"admin","isVerified":true}
router.post("/update-user/:id", userAuth, isAdmin, updateUsers);

export default router;
