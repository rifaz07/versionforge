const jwt = require("jsonwebtoken");

async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied! No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token!" });
  }
}

module.exports = authMiddleware;