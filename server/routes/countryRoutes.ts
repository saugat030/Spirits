import { Router } from "express";
import { getAllCountries, getCountryPhoneCode } from "../controllers/countryController.js";

const router = Router();

router.get("/", getAllCountries);
router.get("/:name", getCountryPhoneCode);

export default router;
