"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userrole_service_1 = __importDefault(require("../services/userrole.service"));
class UserRoleController {
    static async create(req, res) {
        const { role } = req.body;
        if (!role)
            return res.status(400).json({ message: 'Role is required' });
        const result = await userrole_service_1.default.createRole(role);
        res.status(201).json(result);
    }
    static async getAll(req, res) {
        const result = await userrole_service_1.default.getAllRoles();
        res.json(result);
    }
    static async getById(req, res) {
        const id = parseInt(req.params.id);
        const result = await userrole_service_1.default.getRoleById(id);
        if (!result)
            return res.status(404).json({ message: 'Role not found' });
        res.json(result);
    }
    static async update(req, res) {
        const id = parseInt(req.params.id);
        const { role } = req.body;
        const result = await userrole_service_1.default.updateRole(id, role);
        if (!result)
            return res.status(404).json({ message: 'Role not found' });
        res.json(result);
    }
    static async delete(req, res) {
        const id = parseInt(req.params.id);
        const result = await userrole_service_1.default.deleteRole(id);
        if (!result)
            return res.status(404).json({ message: 'Role not found' });
        res.json({ message: 'Role deleted successfully' });
    }
}
exports.default = UserRoleController;
