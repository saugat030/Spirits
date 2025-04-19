const isAdmin = async (req, res, next) => {
  if (req.body.role != "admin") {
    return res.status(401).json({
      success: false,
      message:
        "Unauthorized user. The data you requested requires admin status.",
    });
  }
  next();
};
export default isAdmin;
