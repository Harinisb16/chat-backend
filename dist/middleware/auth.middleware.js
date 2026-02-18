"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate = (req, res, next) => {
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
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // 4️⃣ Attach user to request
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            photo: decoded.photo,
        };
        next();
    }
    catch (error) {
        console.error("JWT verification failed:", error);
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;
