"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserslogin = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = __importDefault(require("../models/user.model"));
const login_model_1 = require("../models/login.model");
const userrole_model_1 = require("../models/userrole.model");
// ================= REGISTER USER =================
const registerUser = async (username, email, password, roleId, firstName, lastName, phone, dob, gender, photo) => {
    // Check if email already exists
    const existingUser = await login_model_1.Login.findOne({ where: { email } });
    if (existingUser)
        throw new Error("User already exists");
    // Hash password
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    // STEP 1 — Create User
    const newUser = await user_model_1.default.create({
        username,
        email,
        phone,
        roleId,
        isOnline: false,
    });
    // STEP 2 — Create Login row linked to User
    const loginRecord = await login_model_1.Login.create({
        username,
        email,
        password: hashedPassword,
        roleId,
        userId: newUser.userId,
        firstName,
        lastName,
        phone,
        dob,
        gender,
        photo,
    });
    return loginRecord;
};
exports.registerUser = registerUser;
// ================= LOGIN USER =================
const loginUser = async (email, password) => {
    const login = await login_model_1.Login.findOne({
        where: { email },
        include: [{ model: userrole_model_1.UserRole, attributes: ["role"] }],
    });
    if (!login)
        throw new Error("Invalid email or password");
    const isMatch = await bcryptjs_1.default.compare(password, login.password);
    if (!isMatch)
        throw new Error("Invalid email or password");
    return {
        id: login.id,
        userId: login.userId,
        username: login.username,
        email: login.email,
        role: login.UserRole?.role || "User",
        photo: login.photo,
    };
};
exports.loginUser = loginUser;
// ================= GET ALL USERS =================
const getAllUserslogin = async () => {
    return await login_model_1.Login.findAll({
        attributes: [
            "id",
            "userId",
            "username",
            "firstName",
            "lastName",
            "phone",
            "dob",
            "gender",
            "photo",
            "email",
            "roleId",
        ],
        include: [{ model: userrole_model_1.UserRole, attributes: ["role"] }],
    });
};
exports.getAllUserslogin = getAllUserslogin;
