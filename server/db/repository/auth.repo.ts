import { and, eq, lt, isNotNull } from "drizzle-orm";
import { db } from "../../config/dbConnect.js";
import { users, refreshTokens, type NewUser } from "../schema/index.js";
import type { DbClient } from "../../types/types.js";

export const deleteRefreshToken = async (token: string, tx: DbClient = db) => {
  await tx.delete(refreshTokens).where(eq(refreshTokens.token, token));
};

export const deleteExpiredTokens = async (userId: string, tx: DbClient = db) => {
  const now = new Date().toISOString();
  await tx.delete(refreshTokens)
    .where(
      and(
        eq(refreshTokens.userId, userId),
        lt(refreshTokens.expiresAt, now)
      )
    );
};
// This is only used by the login service to internally access the password to compare it and never gets sent to the client so no probs in including the password here. I think
export const getUserByEmail = async (email: string, tx: DbClient = db) => {
  // keep password for authentication, but exclude OTP-related fields
  const result = await tx
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      password: users.password,
      google_id: users.google_id,
      role: users.role,
      phone_number: users.phone_number,
      country: users.country,
      address: users.address,
      is_verified: users.is_verified,
      is_active: users.is_active,
    })
    .from(users)
    .where(eq(users.email, email));
  return result[0];
};

export const getUserById = async (id: string, tx: DbClient = db) => {
  const result = await tx
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      phone_number: users.phone_number,
      country: users.country,
      address: users.address,
      is_verified: users.is_verified,
      is_active: users.is_active,
      has_password: isNotNull(users.password),
    })
    .from(users)
    .where(eq(users.id, id));
  return result[0];
};

export const createUser = async (userData: NewUser, tx: DbClient = db) => {
  const result = await tx.insert(users).values(userData).returning({ id: users.id });
  return result[0]!.id;
};

export const updateGoogleId = async (
  userId: string,
  googleId: string,
  is_verified: boolean,
  tx: DbClient = db,
) => {
  if (!is_verified) {
    await tx
      .update(users)
      .set({ google_id: googleId, is_verified: true })
      .where(eq(users.id, userId));
  } else {
    await tx
      .update(users)
      .set({ google_id: googleId })
      .where(eq(users.id, userId));
  }
};

export const createGoogleUser = async (
  data: { email: string; name: string; googleId: string },
  tx: DbClient = db
) => {
  const result = await tx.insert(users).values({
    email: data.email,
    name: data.name,
    google_id: data.googleId,
    is_verified: true,
    role: "user",
    password: null,
  }).returning({ id: users.id, role: users.role });
  
  return result[0]!;
};

export const insertRefreshToken = async (
  userId: string,
  token: string,
  expiresAt: string,
  tx: DbClient = db
) => {
  await tx.insert(refreshTokens).values({
    userId,
    token,
    expiresAt,
  });
};

export const getRefreshToken = async (token: string, tx: DbClient = db) => {
  const result = await tx.select().from(refreshTokens).where(eq(refreshTokens.token, token));
  return result[0]; //return undefined if not found
};

export const updateRefreshToken = async (
  oldToken: string,
  newToken: string,
  newExpiresAt: string,
  tx: DbClient = db
) => {
  await tx.update(refreshTokens)
    .set({
      token: newToken,
      expiresAt: newExpiresAt
    })
    .where(eq(refreshTokens.token, oldToken));
};

export const updateUserOtp = async (
  userId: string,
  otp: string,
  expiresAt: number,
  tx: DbClient = db
) => {
  await tx.update(users)
    .set({ verify_otp: otp, verify_otp_expire_at: expiresAt })
    .where(eq(users.id, userId));
};

// clear verification OTP fields and mark user as verified and active.
export const clearUserOtpAndActivateUser = async (userId: string, tx: DbClient = db) => {
  await tx.update(users)
    .set({ verify_otp: null, verify_otp_expire_at: null, is_verified: true, is_active: true })
    .where(eq(users.id, userId));
};

// fetch the verification OTP data for a user otp and expiry
export const getUserOtpData = async (userId: string, tx: DbClient = db) => {
  const result = await tx
    .select({
      verify_otp: users.verify_otp,
      verify_otp_expire_at: users.verify_otp_expire_at,
    })
    .from(users)
    .where(eq(users.id, userId));
  return result[0];
};

// store a password reset OTP and its expiry on the user record
export const updateResetOtp = async (
  userId: string,
  otp: string,
  expiresAt: number,
  tx: DbClient = db
) => {
  await tx.update(users)
    .set({ resetotp: otp, resetotpexpireat: expiresAt })
    .where(eq(users.id, userId));
};

// clear password-reset OTP fields
export const clearResetOtp = async (userId: string, tx: DbClient = db) => {
  await tx.update(users)
    .set({ resetotp: null, resetotpexpireat: null })
    .where(eq(users.id, userId));
};

// fetch the reset OTP data for a user
export const getResetOtpData = async (userId: string, tx: DbClient = db) => {
  const result = await tx
    .select({
      resetotp: users.resetotp,
      resetotpexpireat: users.resetotpexpireat,
    })
    .from(users)
    .where(eq(users.id, userId));
  return result[0];
};

// update the user's hashed password
export const updateUserPassword = async (
  userId: string,
  hashedPassword: string,
  tx: DbClient = db
) => {
  await tx.update(users)
    .set({ password: hashedPassword })
    .where(eq(users.id, userId));
};