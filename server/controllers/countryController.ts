import { type Request, type Response } from "express";
import { getCountryList, getPhoneCode } from "../data/countries.js";

export const getAllCountries = (req: Request, res: Response): void => {
  const countries = getCountryList();
  res.status(200).json({
    success: true,
    data: countries,
  });
};

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
