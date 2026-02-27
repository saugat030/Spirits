import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/dbConnect.js";
import { type NewUser } from "../db/schema/index.js";
// insertRefreshToken chai crazy function ho that takes both db and tx objects so suuuuuper flexible.
import { getUserByEmail, createUser, insertRefreshToken, deleteExpiredTokens, deleteRefreshToken, getRefreshToken, updateRefreshToken, getUserById } from "../db/repository/auth.repo.js";
import { REFRESH_TOKEN_SECRET, saltRounds } from "../constants/auth.constants.js";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.utils.js";
import type { RefreshTokenPayload } from "../types/types.js";

export const registerUserService = async (userData: NewUser) => {
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) throw new Error("USER_EXISTS");
  const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

  // everything inside here rolls back if any of the step fails
  return await db.transaction(async (tx) => {
    const userId = await createUser({ ...userData, password: hashedPassword }, tx);
    const accessToken = generateAccessToken({ id: userId, role: "user" });
    const refreshToken = generateRefreshToken({ id: userId, role: "user" })
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await insertRefreshToken(userId, refreshToken, expiresAt.toISOString(), tx);
    return { accessToken, refreshToken };
  });
};

export const loginUserService = async (email: string, passwordUnHashed: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }
  // check password
  const isPasswordValid = await bcrypt.compare(passwordUnHashed, user.password);
  if (!isPasswordValid) {
    throw new Error("INVALID_CREDENTIALS");
  }
  const accessToken = generateAccessToken({ id: user.id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id, role: user.role });
  // calculate expiration and save the new refresh token
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  // clean old expired tokens and then insert new ones we store new token for every login for multi device login. 
  await db.transaction(async (tx) => {
    await deleteExpiredTokens(user.id, tx);
    await insertRefreshToken(user.id, refreshToken, expiresAt.toISOString(), tx);
  });

  return { accessToken, refreshToken, role: user.role };
};

export const logoutUserService = async (refreshToken: string | undefined) => {
  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }
};

export const refreshTokensService = async (currentRefreshToken: string) => {
  const tokenRecord = await getRefreshToken(currentRefreshToken);
  if (!tokenRecord) {
    throw new Error("INVALID_TOKEN");
  }
  // clean the dead token
  if (new Date() > new Date(tokenRecord.expiresAt)) {
    await deleteRefreshToken(currentRefreshToken);
    throw new Error("TOKEN_EXPIRED");
  }

  let decoded: RefreshTokenPayload;
  try {
    const verified = jwt.verify(currentRefreshToken, REFRESH_TOKEN_SECRET);
    if (typeof verified === "string") {
      throw new Error("INVALID_PAYLOAD");
    }
    decoded = verified as RefreshTokenPayload;

  } catch (err) {
    // if signature is invalid/tampered, delete it from the db immediately as a security measure
    await deleteRefreshToken(currentRefreshToken);
    throw new Error("INVALID_SIGNATURE");
  }
  // generate new tokens
  const accessToken = generateAccessToken({ id: decoded.id, role: decoded.role });
  const newRefreshToken = generateRefreshToken({ id: decoded.id, role: decoded.role });

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);
  // update the db (rotation + expiration)
  await updateRefreshToken(currentRefreshToken, newRefreshToken, newExpiresAt.toISOString());

  return { accessToken, refreshToken: newRefreshToken };
};

export const getUserDataService = async (userId: string, role: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  // only return the safe data to the frontend
  return {
    name: user.name,
    role: role,
    isAccountVerified: user.isverified,
    email: user.email,
  };
};