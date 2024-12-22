import express from "express";
import pg from "pg";
import cors from "cors";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//Later eslai .env ma store garnu xa.
const app = express();
const port = 3000;
const saltRounds = 10;
const jwtSecret = "TOP_SECRET";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//VVI for runnung projs in different port react ko arkai port ra express ko arkai port huda kam lagne.
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);
//allows to send cookie as the response from the server.
app.use(cookieParser());
app.use(express.json());
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "spirits",
  password: "12345678",
  port: 5432,
});
db.connect();

//Middleware to verify the user valid or not. i.e logged in xa ki xaina vanera.
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  //check if token exists :
  if (!token) {
    return res.json({
      success: false,
      message: "Not Authorized try logging in again",
    });
  }
  //If tokenexists then decode it.
  try {
    const tokenDecode = jwt.verify(token, jwtSecret);
    if (tokenDecode.id) {
      //if the id is valid then store it id in the userId of req.body. Add a new piece of data in the body of the req.body.
      req.body.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Token not valid. User unuthorized. Login again.",
      });
    }
    //This next(); function can only be reaced if the token is valid. So only after the token is valid we go to the next middleware/methd. Natra it will return an error and terminate.
    next();
  } catch (error) {
    res.json({ sucess: false, message: error.message });
  }
};

app.get("/", (req, res) => {
  res.send("Server Running");
});

//Get all Liquor:

app.get("/api/products", async (req, res) => {
  const type = req.query.type;
  console.log(type);
  if (type) {
    try {
      const result = await db.query(
        "select id, name , image_link , description , quantity , categories.type_id , type_name , price from liquors join categories on liquors.type_id = categories.type_id where type_name = ($1) order by id asc",
        [type]
      );
      if (result.rows.length > 0) {
        const data = result.rows;

        //res.json le automatically js object lai jsonify handuinxa so no need :JSON.stringify(data);

        res.json(data);
      } else {
        console.log("No data in the table.");
        res.status(404).json({ message: "No products found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    try {
      const result = await db.query(
        "select id, name , image_link , description , quantity , categories.type_id , type_name , price from liquors join categories on liquors.type_id = categories.type_id order by id asc"
      );
      if (result.rows.length > 0) {
        const data = result.rows;

        //res.json le automatically js object lai jsonify handuinxa so no need :JSON.stringify(data);

        res.json(data);
      } else {
        console.log("No data in the table.");
        res.status(404).json({ message: "No products found" });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

//Registration:

app.post("/signup", async (req, res) => {
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
          console.log("user successfullt registered.");
          //After user registered generate a token for them. And put them in the cookie. the "token" is the cookie name with value as token.
          const token = jwt.sign({ id: insertionQuery.rows[0].id }, jwtSecret, {
            expiresIn: "7d",
          });
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
});

//Login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
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
            const token = jwt.sign({ id: user.id }, jwtSecret, {
              expiresIn: "7d",
            });
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
});

// logout

app.post("/logout", async (req, res) => {
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
});

//Check if user loggedIn:
app.get("/isAuth", userAuth, async (req, res) => {
  try {
    //this function will only be reached if the userAuth middleware calls it. Thats why we can say code ya samma pugyo vaney pani userlogged in nai hunxa.
    return res.json({ success: true, message: "User is authenticated." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

//Get all the user's details:
//This gets the data of the user only if he/she is logged in.
app.get("/user/data", userAuth, async (req, res) => {
  try {
    //userId will come from the isAuthenticated middleware.
    const { userId } = req.body;
    const result = await db.query("select * from users where id = ($1)", [
      userId,
    ]);
    if (result.rows.length > 0) {
      res.json({
        success: true,
        userData: {
          name: result.rows[0].name,
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
});

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});
