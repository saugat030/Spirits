import express from "express";
import {
  greetAdmin,
  getUsers,
  updateUsers,
} from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";

const router = express.Router();
// /api/admin/dashboard
router.get("/dashboard", requireAuth, requireRole(["admin"]), greetAdmin);
router.get("/get-users", requireAuth, requireRole(["admin"]), getUsers);
//example body: {"name":"example","email":"example@example","userRole":"admin","isVerified":true}
router.post("/update-user/:id", requireAuth, requireRole(["admin"]), updateUsers);

export default router;
