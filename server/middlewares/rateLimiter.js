import rateLimit from "express-rate-limit";
//Rate limiter internally calls the next() function. It basically returns a proper middleware that can be used. It only hides it from the developer to look clean.

// General auth rate limiter - for login/signup
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window per IP
  message: {
    success: false,
    message:
      "Too many authentication attempts. Please try again in 15 minutes.",
    retryAfter: 15 * 60, // seconds
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false,
  // Skip successful requests - only count failed ones
  skipSuccessfulRequests: true,
  // Custom key generator - can be IP + email for more granular control
  keyGenerator: (req) => {
    // For login, use IP + email if available
    if (req.body?.email) {
      return `${req.ip}-${req.body.email}`;
    }
    return req.ip;
  },
});

// Stricter limiter for failed login attempts
export const strictAuthLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 attempts per hour
  message: {
    success: false,
    message:
      "Account temporarily locked due to too many failed attempts. Try again in 1 hour.",
    retryAfter: 60 * 60,
  },
  skip: (req, res) => {
    // Only apply this limiter on failed requests (you'll need to call this manually)
    return res.statusCode < 400;
  },
});

// General API rate limiter - for protected routes
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    success: false,
    message: "API rate limit exceeded. Please slow down.",
  },
});

// Refresh token specific limiter
export const refreshLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 refresh attempts per window
  message: {
    success: false,
    message: "Too many token refresh attempts. Please log in again.",
  },
});
