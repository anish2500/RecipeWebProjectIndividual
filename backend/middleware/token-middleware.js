import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  // List of paths that should skip authentication
  const publicPaths = [
    '/api/auth/login',
    '/api/user',
    '/api/admin',
    '/uploads'  // Add uploads path to public routes
  ];

  // Check if the current path starts with any of the public paths
  const isPublicPath = publicPaths.some(path => req.path.startsWith(path));
  
  if (isPublicPath) {
    console.log(`Skipping token verification for public path: ${req.path}`);
    return next();
  }

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    console.log(`No token provided for path: ${req.path}`);
    return res.status(401).send({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, process.env.secretkey, (err, decoded) => {
    if (err) {
      console.log(`Invalid token for path: ${req.path}`);
      return res.status(403).send("Invalid or expired token.");
    }
    req.user = decoded;
    next();
  });
}
