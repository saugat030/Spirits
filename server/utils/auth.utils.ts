import jwt, { type JwtPayload } from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRES_IN, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_EXPIRES_DAYS, REFRESH_TOKEN_SECRET } from "../constants/auth.constants.js";

export function generateAccessToken(payload: JwtPayload) {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRES_IN,
    });
}

export function generateRefreshToken(payload: JwtPayload) {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_DAYS,
    });
}