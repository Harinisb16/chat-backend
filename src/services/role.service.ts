import Role from '../models/role.model';

export default class RoleService {
  static async createRole(role: string) {
    return await Role.create({ role });
  }

  static async getAllRoles() {
    return await Role.findAll();
  }

  static async getRoleById(id: number) {
    return await Role.findByPk(id);
  }

  static async updateRole(id: number, role: string) {
    const existingRole = await Role.findByPk(id);
    if (!existingRole) return null;
    existingRole.role = role;
    await existingRole.save();
    return existingRole;
  }

  static async deleteRole(id: number) {
    const deleted = await Role.destroy({ where: { id } });
    return deleted > 0;
  }
}
