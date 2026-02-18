"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchUserByUsername = exports.fetchAllUsers = void 0;
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
async function fetchAllUsers() {
    const users = await user_model_1.User.findAll({ include: [role_model_1.Role] });
    return users.map(u => ({
        id: u.userId,
        username: u.username,
        email: u.email,
        role: u.role ? u.role.role : null,
    }));
}
exports.fetchAllUsers = fetchAllUsers;
async function fetchUserByUsername(username) {
    const user = await user_model_1.User.findOne({ where: { username }, include: [role_model_1.Role] });
    if (!user)
        return null;
    return {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: user.role ? user.role.role : null,
    };
}
exports.fetchUserByUsername = fetchUserByUsername;
