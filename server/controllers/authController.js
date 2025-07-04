import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbConnect } from "../config/dbConnect.js";
const saltRounds = 10;

const isProduction = process.env.NODE_ENV === "production";
//Signup
export const signup = async (req, res) => {
  //Form bata submited xa vaney it works normally tara if Postman bata xa ani you have selected the body-> raw-> JSON then you need to use a middleware for it. express.json
  const { name, email, password } = req.body;
  console.log(name, email, password);
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
          //After user registered generate a token for them. And put them in the cookie. the "token" is the cookie name with value as token.
          const token = jwt.sign(
            {
              id: insertionQuery.rows[0].id,
              role: "user",
            },
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );
          res.cookie("token", token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "None" : "Lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
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
  console.log("JWT_SECRET value:", process.env.JWT_SECRET); // Remove in production!

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

    try {
      //Check if the password is valid
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("🔐 Password comparison result:", isPasswordValid);
      if (!isPasswordValid) {
        console.log("Invalid password");
        return res.status(401).json({
          success: false,
          message: "Invalid Password.",
        });
      }
      // Password is valid, generate token
      console.log("✅ Password valid, generating token...");

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

      console.log("✅ Token generated successfully");

      // Set cookie
      const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      res.cookie("token", token, cookieOptions);
      console.log("✅ Login successful");
      return res.status(200).json({
        success: true,
        message: "User successfully logged in",
      });
    } catch (bcryptError) {
      console.error("❌ Bcrypt comparison error:", bcryptError);
      return res.status(500).json({
        success: false,
        message: "Password verification failed",
      });
    }
  } catch (error) {
    console.error("❌ Database/Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
//Logout:
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
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
    //userId and role will come from the isAuthenticated middleware.
    const { userId } = req.body;
    const { role } = req.body;
    console.log("user data route hit", req.url);
    console.log("user data", userId, role);
    const db = await dbConnect();
    const result = await db.query("select * from users where id = ($1)", [
      userId,
    ]);
    db.release();
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
    res.status(500).json({ success: false, message: error.message });
  }
};
