import { db } from "../config/dbConnect.js";
import { type Request, type Response } from "express";
import { loginUserService, logoutUserService, refreshTokensService, registerUserService } from "../service/AuthService.js";
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

    res.status(201).json({ success: true, message: "User successfully registered" });
  } catch (err: any) {
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
    const { accessToken, refreshToken } = await loginUserService(email, password);

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

    res.status(200).json({
      success: true,
      message: "User successfully logged in",
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

// get all user data. To access this the user must be logged in.


export const userData = async (req: Request, res: Response): Promise<void> => {
  try {
    // safety check (although requireAuth middleware guarantees this exists)
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const { id, role } = req.user;
    // call the service
    const formattedUserData = await getUserDataService(id, role);
    // send success response
    res.status(200).json({
      success: true,
      userData: formattedUserData,
    });

  } catch (error: any) {
    if (error.message === "USER_NOT_FOUND") {
      // 404 Not Found is more accurate here than 401
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
