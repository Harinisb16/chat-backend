"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_model_1 = __importDefault(require("../models/role.model"));
class RoleService {
    static async createRole(role) {
        return await role_model_1.default.create({ role });
    }
    static async getAllRoles() {
        return await role_model_1.default.findAll();
    }
    static async getRoleById(id) {
        return await role_model_1.default.findByPk(id);
    }
    static async updateRole(id, role) {
        const existingRole = await role_model_1.default.findByPk(id);
        if (!existingRole)
            return null;
        existingRole.role = role;
        await existingRole.save();
        return existingRole;
    }
    static async deleteRole(id) {
        const deleted = await role_model_1.default.destroy({ where: { id } });
        return deleted > 0;
    }
}
exports.default = RoleService;
