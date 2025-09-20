import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbConnect } from "../config/dbConnect.js";

const saltRounds = 10;
const isProduction = process.env.NODE_ENV === "production";
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_DAYS = "7d";

//functions to generate tokens:
function generateAccessToken(payload) {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}
function generateRefreshToken(payload) {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_DAYS,
  });
}
//Signup
export const signup = async (req, res) => {
  //Form bata submited xa vaney it works normally tara if Postman bata xa ani you have selected the body-> raw-> JSON then you need to use a middleware for it. express.json
  const { name, email, password } = req.body;
  //check if name, email, and password exists :
  if (!name || !email || !password) {
    return res.status(401).json({
      success: false,
      message: "Missing some registration details",
    });
  }

  //This try catch catches the database errors:
  try {
    //Check if the user already exists:
    const db = await dbConnect();
    const checkExisting = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (checkExisting.rows.length > 0) {
      console.log("User already exixts");
      res.status(409).json({ success: false, message: "User already exists." });
    } else {
      //User is new and needs to be added:
      //hashing the password and saving it in the database:
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          //Error during hasing ko lagi:
          console.error("Error hashing password:", err);
        } else {
          console.log("Hashed Password:", hash);
          let insertionQuery = await db.query(
            "insert into users (name ,email, password) values ($1, $2 , $3) returning id",
            [name, email, hash]
          );
          console.log("user successfully registered.");
          const userId = insertionQuery.rows[0].id;
          //After user registered generate a token for them. And put them in the cookie. the "token" is the cookie name with value as token.
          // generate tokens
          const accessToken = generateAccessToken({ id: userId, role: "user" });
          const refreshToken = generateRefreshToken({
            id: userId,
            role: "user",
          });
          //Add the refresh tokens into the databse:
          await db.query(
            "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + interval '7 days')",
            [userId, refreshToken]
          );
          //cookies ma haldera both tokens pathaune. Refresh tokens pathauna ko reason chai paxi /refresh tokens garda we check if that token exists in the database.
          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 15 * 60 * 1000, // 15 minutes
          });
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          });
          return res.status(201).json({
            success: true,
            message: "User successfully registered",
          });
        }
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
//Login logic
export const login = async (req, res) => {
  console.log("Login Route Hit");
  console.log("Request body:", req.body);

  const { email, password } = req.body;

  console.log("Email:", email);
  console.log("Password", password);

  // Super basic validation
  if (!email || !password) {
    console.error("Missing email or password");
    return res.status(400).json({
      success: false,
      message: "Missing details with either email or password",
    });
  }

  try {
    const db = await dbConnect();
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    console.log("Database query result:", {
      rowCount: result.rows.length,
      userFound: result.rows.length > 0,
    });

    if (result.rows.length === 0) {
      console.error("User not found in database");
      return res.status(401).json({
        success: false,
        message: "User account with the requested email not found.",
      });
    }

    const user = result.rows[0];
    console.log("User found:", {
      id: user.id,
      email: user.email,
      role: user.role,
      hasPassword: user.password ? "Yes" : "No",
    });
    const userId = user.id;
    const role = user.role;

    try {
      //Check if the password is valid
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("Password comparison result:", isPasswordValid);
      if (!isPasswordValid) {
        console.log("Invalid password");
        return res.status(401).json({
          success: false,
          message: "Invalid Password.",
        });
      }
      // Password is valid, generate token
      console.log("Password valid, generating token...");
      const accessToken = generateAccessToken({ id: userId, role: role });
      const refreshToken = generateRefreshToken({ id: userId, role: role });
      //Add the refresh tokens into the databse:
      await db.query(
        "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES ($1, $2, NOW() + interval '7 days')",
        [userId, refreshToken]
      );
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      console.log("✅ Login successful");
      return res.status(200).json({
        success: true,
        message: "User successfully logged in",
      });
    } catch (bcryptError) {
      console.error("Bcrypt comparison error:", bcryptError);
      return res.status(500).json({
        success: false,
        message: "Password verification failed",
      });
    }
  } catch (error) {
    console.error(" Database/Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//Logout:
export const logout = async (req, res) => {
  try {
    const db = await dbConnect();
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await db.query("DELETE FROM refresh_tokens WHERE token = $1", [
        refreshToken,
      ]);
    }
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    return res.status(200).json({ success: true, message: "Logged Out." });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//Check if user loggedIn:
//also add the userAuth middleware that checks if the user is loggedin.
export const isAuth = async (req, res) => {
  console.log("isAuth reached.");
  try {
    //this function will only be reached if the userAuth middleware calls it. Thats why we can say code ya samma pugyo vaney pani userlogged in nai hunxa.
    return res
      .status(200)
      .json({ success: true, message: "User is authenticated." });
  } catch (error) {
    console.error("Error in the isAuth function", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
//Get all user data. To access this the user must be logged in.
export const userData = async (req, res) => {
  try {
    // userId and role now come from req.user (set in userAuth middleware)
    const { userId, role } = req.user;
    console.log("user data route hit", req.url);
    console.log("user data", userId, role);
    const db = await dbConnect();
    const result = await db.query("select * from users where id = ($1)", [
      userId,
    ]);
    if (result.rows.length > 0) {
      res.status(200).json({
        success: true,
        userData: {
          name: result.rows[0].name,
          role: role,
          isAccountVerified: result.rows[0].isverified,
          email: result.rows[0].email,
        },
      });
    } else {
      return res.status(401).json({
        succes: false,
        message: "User with that ID not found.",
      });
    }
  } catch (error) {
    console.error("ERROR IN GET USER DATA ROUTE", error.message);
    db.release();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    db.release();
  }
};

export const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  let db;
  try {
    db = await dbConnect();

    // 1. Check if token exists in DB
    const result = await db.query(
      "SELECT * FROM refresh_tokens WHERE token = $1",
      [refreshToken]
    );

    if (result.rows.length === 0) {
      db.release();
      return res
        .status(403)
        .json({ success: false, message: "Invalid refresh token" });
    }
    //Check if the token has expired. Even though jwt automaticcaly chesks the expired tokens, this is to cleanup the database for old tokens so that the db doesnot bloat.
    const tokenData = result.rows[0];
    if (new Date() > new Date(tokenData.expires_at)) {
      await db.query("DELETE FROM refresh_tokens WHERE token = $1", [
        refreshToken,
      ]);
      return res
        .status(403)
        .json({ success: false, message: "Refresh token expired" });
    }

    // 2. Verify signature
    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        db.release();
        return res.status(403).json({
          success: false,
          message: "Invalid refresh token. Decoding failed.",
        });
      }

      // 3. Generate new tokens
      const accessToken = generateAccessToken({
        id: decoded.id,
        role: decoded.role,
      });
      const newRefreshToken = generateRefreshToken({
        id: decoded.id,
        role: decoded.role,
      });

      // 4. Replace old refresh token with new one (rotation)
      await db.query("UPDATE refresh_tokens SET token = $1 WHERE token = $2", [
        newRefreshToken,
        refreshToken,
      ]);

      // 5. Send new tokens back
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      db.release();
      return res.json({
        success: true,
        message: "Access token refreshed",
        accessToken,
      });
    });
  } catch (err) {
    console.error(err);
    if (db) db.release();
    res.status(500).json({ success: false, message: "Server error" });
  }
};
