"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupService = void 0;
// signup.service.ts
const signup_model_1 = require("../models/signup.model");
class SignupService {
    // Create new user
    async createUser(data) {
        return await signup_model_1.Signup.create(data); // quick fix, but not type-safe
    }
    // Get all users
    async getAllUsers() {
        return await signup_model_1.Signup.findAll();
    }
    // Get user by ID
    async getUserById(id) {
        return await signup_model_1.Signup.findByPk(id);
    }
    // Update user
    async updateUser(id, data) {
        return await signup_model_1.Signup.update(data, {
            where: { id },
            returning: true,
        });
    }
    // Delete user
    async deleteUser(id) {
        return await signup_model_1.Signup.destroy({
            where: { id },
        });
    }
}
exports.SignupService = SignupService;
