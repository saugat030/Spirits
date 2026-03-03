import { and, eq, lt } from "drizzle-orm";
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
      role: users.role,
      is_verified: users.is_verified,
      is_active: users.is_active,
    })
    .from(users)
    .where(eq(users.email, email));
  return result[0];
};

// this excludes the password since it is sent to the fe
export const getUserById = async (id: string, tx: DbClient = db) => {
  const result = await tx
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      is_verified: users.is_verified,
      is_active: users.is_active,
    })
    .from(users)
    .where(eq(users.id, id));
  return result[0];
};

export const createUser = async (userData: NewUser, tx: DbClient = db) => {
  const result = await tx.insert(users).values(userData).returning({ id: users.id });
  return result[0]!.id;
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