import { Router } from "express";
import { getAllCountries, getCountryPhoneCode } from "../controllers/countryController.js";

const router = Router();

// /api/countries
router.get("/", getAllCountries);
router.get("/:name", getCountryPhoneCode);

export default router;
