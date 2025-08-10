import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JwtUserPayload } from "../types"; // your own interface


export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");

    if (typeof decoded === "string") {
      return res.status(403).json({ error: "Invalid token payload" });
    }

    req.user = {
      username: decoded.username,
      role: decoded.role,
    };

    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
};


