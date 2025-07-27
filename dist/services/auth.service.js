"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const login_model_1 = require("../models/login.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerUser = async (email, password) => {
    const existingUser = await login_model_1.Login.findOne({ where: { email } });
    if (existingUser)
        throw new Error('User already exists');
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    return await login_model_1.Login.create({ email, password: hashedPassword });
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await login_model_1.Login.findOne({ where: { email } });
    if (!user)
        throw new Error('Invalid email or password');
    const isMatch = await bcryptjs_1.default.compare(password, user.password);
    if (!isMatch)
        throw new Error('Invalid email or password');
    return user;
};
exports.loginUser = loginUser;
