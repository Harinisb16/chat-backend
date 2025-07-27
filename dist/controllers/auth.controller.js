"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, auth_service_1.registerUser)(email, password);
        res.status(201).json({ message: 'User registered', user });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, auth_service_1.loginUser)(email, password);
        const token = (0, jwt_1.generateToken)({ id: user.id, email: user.email });
        res.status(200).json({ message: 'Login successful', token });
    }
    catch (err) {
        res.status(401).json({ error: err.message });
    }
};
exports.login = login;
