import jwt from "jsonwebtoken";
//Middleware to verify the user valid or not. i.e logged in xa ki xaina vanera.
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  //check if token exists :
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not Authorized try logging in again",
    });
  }
  //If tokenexists then decode it.
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      //if the id is valid then store it id in the userId and role into role of req.body. Add a new piece of data in the body of the req.body.
      req.body.userId = tokenDecode.id;
      req.body.role = tokenDecode.role;
    } else {
      return res.json({
        success: false,
        message: "Token not valid. User unuthorized. Login again.",
      });
    }
    //This next(); function can only be reaced if the token is valid. So only after the token is valid we go to the next middleware/methd. Natra it will return an error and terminate.
    next();
  } catch (error) {
    console.error(error.message);
    res.json({ sucess: false, message: error.message });
  }
};
export default userAuth;
