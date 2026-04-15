import crypto from "crypto";

export const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

export const otpExpiresAt = (minutes: number = 10): number => {
  return Math.floor(Date.now() / 1000) + minutes * 60;
};
