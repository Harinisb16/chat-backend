import { UserRole } from "../models/userrole.model";

export default class UserRoleService {
  static async createRole(role: string) {
    return await UserRole.create({ role });
  }

  static async getAllRoles() {
    return await UserRole.findAll();
  }

  static async getRoleById(id: number) {
    return await UserRole.findByPk(id);
  }

  static async updateRole(id: number, role: string) {
    const existingRole = await UserRole.findByPk(id);
    if (!existingRole) return null;
    existingRole.role = role;
    await existingRole.save();
    return existingRole;
  }

  static async deleteRole(id: number) {
    const deleted = await UserRole.destroy({ where: { id } });
    return deleted > 0;
  }
}
