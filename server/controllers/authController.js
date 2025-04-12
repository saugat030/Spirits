import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { dbConnect } from "../config/dbConnect.js";
const saltRounds = 10;

//Signup
export const signup = async (req, res) => {
  //Form bata submited xa vaney it works normally tara if Postman bata xa ani you have selected the body-> raw-> JSON then you need to use a middleware for it. express.json
  const { name, email, password } = req.body;
  console.log(name, email, password);
  //check if name, email, and password exists :
  if (!name || !email || !password) {
    return res.json({
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
      res.json({ success: false, message: "User already exists..." });
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
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 1000,
          });
          return res.json({
            success: true,
            message: "User successfully registered",
          });
        }
      });
    }
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};
//Login logic
export const login = async (req, res) => {
  console.log("Login Route Hit");
  const { email, password } = req.body;
  console.log(email);
  //check if the email or pass exists.
  console.log(email, password);
  if (!email || !password) {
    return res.json({
      success: false,
      message: "Missing details wither email or password",
    });
  }
  //Check for db errors:
  try {
    //check is the user exists in the databse:
    const db = await dbConnect();
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      //this if else block checks if user exists in the databse.
      //if user exists then :
      const user = result.rows[0];
      const storedHashedPassword = user.password;
      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          //this if block checks if comparing was successfull:
          console.error("Error comparing passwords:", err);
        } else {
          //If no error in comparing password then the result is obtained which is either 0 or 1. 0 if false 1 if true.
          if (result) {
            //If result is true and password and email matches , generate a token.
            const token = jwt.sign(
              { id: user.id, role: user.role },
              jwtSecret,
              {
                expiresIn: "7d",
              }
            );
            //send the token in the cookie
            res.cookie("token", token, {
              httpOnly: true,
              secure: false,
              sameSite: "lax",
              maxAge: 7 * 24 * 60 * 1000,
            });
            return res.json({
              success: true,
              message: "User successfully logged in",
            });
          } else {
            res.json({ success: false, message: "Invalid Password." });
          }
        }
      });
    } else {
      //If email not found in the database
      console.log("User not found. Try signing in..");
      return res.json({
        success: false,
        message:
          "Invalid email. Check your email or password or try signing in.",
      });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
//Logout:
export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    return res.json({ success: true, message: "Logged Out." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//Check if user loggedIn:
//also add the userAuth middleware that checks if the user is loggedin.
export const isAuth = async (req, res) => {
  try {
    //this function will only be reached if the userAuth middleware calls it. Thats why we can say code ya samma pugyo vaney pani userlogged in nai hunxa.
    return res.json({ success: true, message: "User is authenticated." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//Get all user data. To access this the user must be logged in.
export const userData = async (req, res) => {
  try {
    //userId and role will come from the isAuthenticated middleware.
    const { userId } = req.body;
    const { role } = req.body;
    const result = await db.query("select * from users where id = ($1)", [
      userId,
    ]);
    if (result.rows.length > 0) {
      res.json({
        success: true,
        userData: {
          name: result.rows[0].name,
          role: role,
          isAccountVerified: result.rows[0].isverified,
          email: result.rows[0].email,
        },
      });
    } else {
      return res.json({
        succes: false,
        message: "User with that id not found.",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
