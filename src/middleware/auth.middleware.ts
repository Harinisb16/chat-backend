import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtUserPayload } from "../types";

/* Extend Express Request to include user */
export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    // 1️⃣ Check token presence
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];

    // 2️⃣ Ensure JWT secret exists
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not set");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, secret) as JwtUserPayload;

    // 4️⃣ Attach user to request
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      photo: decoded.photo,
    };

    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};
