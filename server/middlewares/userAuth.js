import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  // No access token at all
  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "No access token. Please log in.",
    });
  }

  try {
    // Try to verify access token
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = { userId: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    // Access token invalid/expired - try to refresh
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "Access token expired and no refresh token available.",
      });
    }

    try {
      // Call your refresh logic
      const refreshResult = await attemptTokenRefresh(refreshToken, res);
      if (refreshResult.success) {
        req.user = { userId: refreshResult.userId, role: refreshResult.role };
        next();
      } else {
        return res.status(401).json({
          success: false,
          message: "Could not refresh token. Please log in again.",
        });
      }
    } catch (refreshErr) {
      return res.status(401).json({
        success: false,
        message: "Token refresh failed. Please log in again.",
      });
    }
  }
};
export default userAuth;

//Old implementation:
// import jwt from "jsonwebtoken";
// //Middleware to verify the user valid or not. i.e logged in xa ki xaina vanera.
// const userAuth = async (req, res, next) => {
//   const { token } = req.cookies;
//   console.log("Logging token ", token);
//   console.log("auth middleware reached.");
//   //check if token exists :
//   if (!token) {
//     return res.status(401).json({
//       success: false,
//       message: "Not Authorized try logging in again",
//     });
//   }
//   //If tokenexists then decode it.
//   try {
//     const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
//     if (tokenDecode.id) {
//       //if the id is valid then store it id in the userId and role into role of req.body. Add a new piece of data in the body of the req.body.
//       req.body.userId = tokenDecode.id;
//       req.body.role = tokenDecode.role;
//     } else {
//       return res.status(401).json({
//         success: false,
//         message: "Token not valid. User unuthorized. Login again.",
//       });
//     }
//     //This next(); function can only be reaced if the token is valid. So only after the token is valid we go to the next middleware/methd. Natra it will return an error and terminate.
//     next();
//   } catch (error) {
//     console.error("Log from userAuth middleware " + error.message);
//     res.status(400).json({ sucess: false, message: error.message });
//   }
// };
// export default userAuth;
