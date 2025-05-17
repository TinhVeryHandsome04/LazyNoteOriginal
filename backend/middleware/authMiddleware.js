const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Access denied" });
  }

  try {
    const verified = jwt.verify(token, "key trong env");
    req.user = verified;
    console.log("Log middleWare3");

    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;
