import { type Request, type Response } from "express";
import { getCountryList, getPhoneCode } from "../data/countries.js";

/**
 * GET /api/countries
 * Returns the full list of countries with their phone codes.
 */
export const getAllCountries = (req: Request, res: Response): void => {
  const countries = getCountryList();
  res.status(200).json({
    success: true,
    data: countries,
  });
};

/**
 * GET /api/countries/:name
 * Returns the phone code for a specific country.
 */
export const getCountryPhoneCode = (req: Request, res: Response): void => {
  const name = req.params.name as string;
  const phoneCode = getPhoneCode(name);

  if (!phoneCode) {
    res.status(404).json({
      success: false,
      message: `Country "${name}" not found.`,
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: { name, phoneCode },
  });
};
