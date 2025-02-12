import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {

  const token = req.header("Authorization")?.split(" ")[1];
  // Skip token verification for the login route
  if (req.path === "/api/auth/login" || req.path === "/api/user" || req.path === "/api/admin") {
    console.log(`Skipping token verification for ${req.path}`); // Debugging: Log skipped routes
    return next();
  }

  // Get token from Authorization header


  if (!token) {
    return res
      .status(401)
      .send({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.secretkey, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid or expired token.");
    }
    req.user = decoded; // Attach decoded payload to request object
    next(); // Proceed to the next middleware or route handler
  });
}
