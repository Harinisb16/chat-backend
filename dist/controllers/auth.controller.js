"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.markOnline = exports.logoutUser = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_service_1 = require("../services/auth.service");
const user_model_1 = __importDefault(require("../models/user.model"));
/* ================= REGISTER ================= */
const register = async (req, res) => {
    try {
        const { username, email, password, roleId, firstName, lastName, phone, dob, gender, } = req.body;
        const photo = req.file?.path || "";
        const user = await (0, auth_service_1.registerUser)(username, email, password, Number(roleId), firstName, lastName, phone, dob, gender, photo);
        res.status(201).json({
            message: "User registered successfully",
            user,
        });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.register = register;
/* ================= LOGIN ================= */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const loginUser = await (0, auth_service_1.loginUser)(email, password);
        const user = await user_model_1.default.findByPk(loginUser.userId);
        if (!user) {
            return res.status(404).json({ error: "User record not found" });
        }
        /* Mark user online */
        await user.update({
            isOnline: true,
            lastLogin: new Date(),
            offlineNotified: false,
        });
        /* 🔑 Generate JWT */
        const token = jsonwebtoken_1.default.sign({
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: loginUser.role, // ✅ safest source
        }, process.env.JWT_SECRET, { expiresIn: "1d" });
        return res.status(200).json({
            token,
            user: {
                userId: user.userId,
                username: user.username,
                email: user.email,
                role: loginUser.role,
            },
        });
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
};
exports.login = login;
/* ================= LOGOUT ================= */
const logoutUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await user_model_1.default.findByPk(req.user.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.update({ isOnline: false });
        res.json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.logoutUser = logoutUser;
/* ================= MARK ONLINE ================= */
const markOnline = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await user_model_1.default.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await user.update({ isOnline: true });
        res.json({ message: "User marked online", user });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.markOnline = markOnline;
/* ================= GET ALL USERS ================= */
const getAll = async (_req, res) => {
    try {
        const users = await (0, auth_service_1.getAllUserslogin)();
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAll = getAll;
