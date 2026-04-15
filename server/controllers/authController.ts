import { db } from "../config/dbConnect.js";
import { type Request, type Response } from "express";
import {
  loginUserService,
  logoutUserService,
  refreshTokensService,
  registerUserService,
  sendVerificationOtpService,
  verifyEmailOtpService,
  sendResetOtpService,
  resetPasswordService,
  changePasswordService,
} from "../service/AuthService.js";
import { isProduction } from "../constants/auth.constants.js";
import { getUserDataService } from "../service/AuthService.js";

// signup
export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400).json({ success: false, message: "Missing registration details" });
    return;
  }

  try {
    const { accessToken, refreshToken } = await registerUserService({
      name,
      email,
      password,
      role: "user",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true, message: "User successfully registered. Verification OTP sent to email." });
  } catch (err:any) {
    if (err.message === "USER_EXISTS") {
      res.status(409).json({ success: false, message: "User already exists." });
      return;
    }
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({
      success: false,
      message: "Missing details with either email or password"
    });
    return;
  }

  try {
    const { accessToken, refreshToken, role } = await loginUserService(email, password);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log(`${role} logged in`);
    res.status(200).json({
      success: true,
      message: `${role} successfully logged in`,
    });

  } catch (err: any) {
    if (err.message === "INVALID_CREDENTIALS") {
      res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
      return;
    }
    console.error("Login Server Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await logoutUserService(refreshToken);
    // define the exact options used to create the cookies coz ajkal ko browser too strict
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    };
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    console.info("Logged out");
    res.status(200).json({
      success: true,
      message: "Logged Out."
    });

  } catch (error) {
    console.error("Logout Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const isAuth = async (req: Request, res: Response): Promise<void> => {
  // If the code reaches here, the middleware has already guaranteed they are valid.
  res.status(200).json({
    success: true,
    message: "User is authenticated.",
    user: req.user
  });
};

export const userData = async (req: Request, res: Response): Promise<void> => {
  try {
    // safety check (requireAuth le guarantee garxa tei pani ts lai khusi parna)
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { id, role } = req.user;
    const user = await getUserDataService(id, role);
    console.log("User data found, sending the response.")
    res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      res.status(404).json({ success: false, message: "User with that ID not found." });
      return;
    }
    console.error("GET USER DATA ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    res.status(401).json({ success: false, message: "No refresh token" });
    return;
  }
  try {
    const tokens: { accessToken: string, refreshToken: string } = await refreshTokensService(refreshToken);
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    };

    res.cookie("accessToken", tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000
    });
    res.cookie("refreshToken", tokens.refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
      accessToken: tokens.accessToken,
    });

  } catch (error: any) {
    const authErrors = ["INVALID_TOKEN", "TOKEN_EXPIRED", "INVALID_SIGNATURE"];
    if (authErrors.includes(error.message)) {
      // if a refresh token fails, clear the cookies so the fe can log out the user immediately
      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");
      res.status(403).json({ success: false, message: "Invalid or expired refresh token. Please log in again." });
      return;
    }
    console.error("Refresh Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// sends a verification OTP to the logged-in user's email.
// useful for existing unverified accounts to manually trigger verification.
export const sendVerificationOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    await sendVerificationOtpService(req.user.id);
    res.status(200).json({ success: true, message: "Verification OTP sent to your email." });

  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    if (err.message === "ALREADY_VERIFIED") {
      res.status(400).json({ success: false, message: "Email is already verified." });
      return;
    }
    console.error("Send Verification OTP Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// verifies the user's email using the OTP from the request body.
export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { otp } = req.body;
    if (!otp) {
      res.status(400).json({ success: false, message: "OTP is required." });
      return;
    }

    await verifyEmailOtpService(req.user.id, otp);
    console.log("Email verified successfully.");
    
    res.status(200).json({ success: true, message: "Email verified successfully." });

  } catch (err: any) {
    const otpErrors: Record<string, string> = {
      "NO_OTP_FOUND": "No verification OTP found. Please request a new one.",
      "OTP_EXPIRED": "OTP has expired. Please request a new one.",
      "INVALID_OTP": "Invalid OTP. Please try again.",
    };
    if (otpErrors[err.message]) {
      res.status(400).json({ success: false, message: otpErrors[err.message] });
      return;
    }
    console.error("Verify Email Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// sends a password reset OTP to the given email.
// always returns 200 to prevent email enumeration for hackers
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: "Email is required." });
      return;
    }
    await sendResetOtpService(email);
    // always return 200 regardless of whether user exists 
    res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset OTP has been sent.",
    });

  } catch (err: any) {
    console.error("Forgot Password Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// resets the password using the email, OTP, and new password.
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      res.status(400).json({ success: false, message: "Email, OTP, and new password are required." });
      return;
    }
    await resetPasswordService(email, otp, newPassword);
    res.status(200).json({ success: true, message: "Password reset successfully." });

  } catch (err: any) {
    const errorMap: Record<string, { status: number; message: string }> = {
      "INVALID_CREDENTIALS": { status: 401, message: "Invalid email." },
      "NO_OTP_FOUND": { status: 400, message: "No reset OTP found. Please request a new one." },
      "OTP_EXPIRED": { status: 400, message: "OTP has expired. Please request a new one." },
      "INVALID_OTP": { status: 400, message: "Invalid OTP. Please try again." },
    };
    const mapped = errorMap[err.message];
    if (mapped) {
      res.status(mapped.status).json({ success: false, message: mapped.message });
      return;
    }
    console.error("Reset Password Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// changes the password for the authenticated user
export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: "Current password and new password are required." });
      return;
    }

    await changePasswordService(req.user.id, currentPassword, newPassword);
    res.status(200).json({ success: true, message: "Password changed successfully." });

  } catch (err: any) {
    if (err.message === "USER_NOT_FOUND") {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    if (err.message === "INVALID_CURRENT_PASSWORD") {
      res.status(401).json({ success: false, message: "Current password is incorrect." });
      return;
    }
    console.error("Change Password Error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
