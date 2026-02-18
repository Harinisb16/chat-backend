"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userrole_model_1 = require("../models/userrole.model");
class UserRoleService {
    static async createRole(role) {
        return await userrole_model_1.UserRole.create({ role });
    }
    static async getAllRoles() {
        return await userrole_model_1.UserRole.findAll();
    }
    static async getRoleById(id) {
        return await userrole_model_1.UserRole.findByPk(id);
    }
    static async updateRole(id, role) {
        const existingRole = await userrole_model_1.UserRole.findByPk(id);
        if (!existingRole)
            return null;
        existingRole.role = role;
        await existingRole.save();
        return existingRole;
    }
    static async deleteRole(id) {
        const deleted = await userrole_model_1.UserRole.destroy({ where: { id } });
        return deleted > 0;
    }
}
exports.default = UserRoleService;
