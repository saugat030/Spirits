import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/dbConnect.js";
import { type NewUser } from "../db/schema/index.js";
// insertRefreshToken chai crazy function ho that takes both db and tx objects so suuuuuper flexible.
import {
  getUserByEmail,
  createUser,
  insertRefreshToken,
  deleteExpiredTokens,
  deleteRefreshToken,
  getRefreshToken,
  updateRefreshToken,
  getUserById,
  updateUserOtp,
  clearUserOtpAndActivateUser,
  getUserOtpData,
  updateResetOtp,
  clearResetOtp,
  getResetOtpData,
  updateUserPassword,
  updateGoogleId,
  createGoogleUser,
} from "../db/repository/auth.repo.js";
import {
  REFRESH_TOKEN_SECRET,
  saltRounds,
} from "../constants/auth.constants.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/auth.utils.js";
import { OAuth2Client } from "google-auth-library";
import { generateOtp, otpExpiresAt } from "../utils/otp.utils.js";
import { sendOtpEmail } from "../utils/email.utils.js";
import type { RefreshTokenPayload } from "../types/types.js";
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const registerUserService = async (userData: NewUser) => {
  const existingUser = await getUserByEmail(userData.email);
  if (existingUser) throw new Error("USER_EXISTS");
  const hashedPassword = await bcrypt.hash(userData.password!, saltRounds);

  // everything inside here rolls back if any of the step fails
  return await db.transaction(async (tx) => {
    const userId = await createUser(
      { ...userData, password: hashedPassword },
      tx,
    );
    const accessToken = generateAccessToken({ id: userId, role: "user" });
    const refreshToken = generateRefreshToken({ id: userId, role: "user" });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await insertRefreshToken(userId, refreshToken, expiresAt.toISOString(), tx);

    // auto send verification OTP on signup
    const otp = generateOtp();
    const otpExpiry = otpExpiresAt(10);
    await updateUserOtp(userId, otp, otpExpiry, tx);
    // send email outside the transaction (fire and forget with error logging)
    sendOtpEmail(userData.email, otp, "verify").catch((err) => {
      console.error("Failed to send verification email on signup:", err);
    });

    return { accessToken, refreshToken };
  });
};

export const googleAuthService = async (idToken: string) => {
  // verify the token with Google
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });
  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid Google token payload");
  }
  let isNewUser = false;
  const { email, name, sub: googleId } = payload;

  return await db.transaction(async (tx) => {
    const existingUser = await getUserByEmail(email, tx);
    let userId: string;
    let userRole: "admin" | "user";
    if (existingUser) {
      // user exists. If they don't have a google_id yet, the local user is logging in with Google for the first time so link them
      if (!existingUser.google_id) {
        await updateGoogleId(
          existingUser.id,
          googleId,
          existingUser.is_verified,
          tx,
        );
      }
      userId = existingUser.id;
      userRole = existingUser.role;
    } else {
      // user does not exist. Create them instantly.
      isNewUser = true;
      const newUser = await createGoogleUser(
        { email, name: name || "Google User", googleId },
        tx,
      );
      userId = newUser.id;
      userRole = newUser.role;
    }
    // normal token flow
    const accessToken = generateAccessToken({ id: userId, role: userRole });
    const refreshToken = generateRefreshToken({ id: userId, role: userRole });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await insertRefreshToken(userId, refreshToken, expiresAt.toISOString(), tx);

    return { accessToken, refreshToken, isNewUser };
  });
};

export const loginUserService = async (
  email: string,
  passwordUnHashed: string,
) => {
  const user = await getUserByEmail(email);
  // if a user exists but only through google then pw will be null.
  if (!user || !user.password) {
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
    await insertRefreshToken(
      user.id,
      refreshToken,
      expiresAt.toISOString(),
      tx,
    );
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
    throw new Error("INVALID_SIGNATURE", { cause: err });
  }
  // generate new tokens
  const accessToken = generateAccessToken({
    id: decoded.id,
    role: decoded.role,
  });
  const newRefreshToken = generateRefreshToken({
    id: decoded.id,
    role: decoded.role,
  });

  const newExpiresAt = new Date();
  newExpiresAt.setDate(newExpiresAt.getDate() + 7);
  // update the db (rotation + expiration)
  await updateRefreshToken(
    currentRefreshToken,
    newRefreshToken,
    newExpiresAt.toISOString(),
  );

  return { accessToken, refreshToken: newRefreshToken };
};

export const getUserDataService = async (userId: string, role: string) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }
  // only return the safe data to the frontend
  return user;
};

// generates a verification OTP, stores it, and sends it to the user's email
// mainly for users who want to verify later
export const sendVerificationOtpService = async (userId: string) => {
  const user = await getUserById(userId);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (user.is_verified) throw new Error("ALREADY_VERIFIED");

  const otp = generateOtp();
  const expiry = otpExpiresAt(10);
  await updateUserOtp(userId, otp, expiry);
  await sendOtpEmail(user.email, otp, "verify");
};

// verifies the user's email using the provided OTP. compares OTP checks expiry then marks the account as verified
export const verifyEmailOtpService = async (userId: string, otp: string) => {
  const otpData = await getUserOtpData(userId);
  if (!otpData || !otpData.verify_otp) throw new Error("NO_OTP_FOUND");

  const now = Math.floor(Date.now() / 1000);
  if (otpData.verify_otp_expire_at && now > otpData.verify_otp_expire_at) {
    throw new Error("OTP_EXPIRED");
  }
  if (otpData.verify_otp !== otp) {
    throw new Error("INVALID_OTP");
  }
  await clearUserOtpAndActivateUser(userId);
};

// sends a password reset OTP to the given email address.
export const sendResetOtpService = async (email: string) => {
  const user = await getUserByEmail(email);
  if (!user) {
    console.log("User not found returning.");
    return;
  } // silent fail to prevent email enumeration

  const otp = generateOtp();
  const expiry = otpExpiresAt(10);
  await updateResetOtp(user.id, otp, expiry);
  await sendOtpEmail(email, otp, "reset");
};

// verifies OTP then hashes new password then updates DB then clears OTP fields.
export const resetPasswordService = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error("INVALID_CREDENTIALS");

  const otpData = await getResetOtpData(user.id);
  if (!otpData || !otpData.resetotp) throw new Error("NO_OTP_FOUND");

  const now = Math.floor(Date.now() / 1000);
  if (otpData.resetotpexpireat && now > otpData.resetotpexpireat) {
    throw new Error("OTP_EXPIRED");
  }

  if (otpData.resetotp !== otp) {
    throw new Error("INVALID_OTP");
  }

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  await db.transaction(async (tx) => {
    await updateUserPassword(user.id, hashedPassword, tx);
    await clearResetOtp(user.id, tx);
  });
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
) => {
  // getUserById doesn't include password, so we get user data first then look up via email
  const userData = await getUserById(userId);
  if (!userData) throw new Error("USER_NOT_FOUND");

  // getUserByEmail includes the password hash for comparison
  const fullUser = await getUserByEmail(userData.email);
  if (!fullUser) throw new Error("USER_NOT_FOUND");
  if (!fullUser.password) throw new Error("NO_LOCAL_PASSWORD");

  const isPasswordValid = await bcrypt.compare(
    currentPassword,
    fullUser.password,
  );
  if (!isPasswordValid) throw new Error("INVALID_CURRENT_PASSWORD");

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  await updateUserPassword(userId, hashedPassword);
};

export const setPasswordService = async (
  userId: string,
  newPassword: string,
) => {
  const userData = await getUserById(userId);
  if (!userData) throw new Error("USER_NOT_FOUND");

  // check if the user already has a password set
  const fullUser = await getUserByEmail(userData.email);
  if (!fullUser) throw new Error("USER_NOT_FOUND");
  if (fullUser.password) throw new Error("PASSWORD_ALREADY_SET");

  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
  await updateUserPassword(userId, hashedPassword);
};
