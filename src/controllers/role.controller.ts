import { Request, Response } from 'express';
import RoleService from '../services/role.service';

export default class RoleController {
  static async create(req: Request, res: Response) {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'Role is required' });

    const result = await RoleService.createRole(role);
    res.status(201).json(result);
  }

  static async getAll(req: Request, res: Response) {
    const result = await RoleService.getAllRoles();
    res.json(result);
  }

  static async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await RoleService.getRoleById(id);
    if (!result) return res.status(404).json({ message: 'Role not found' });
    res.json(result);
  }

  static async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const { role } = req.body;
    const result = await RoleService.updateRole(id, role);
    if (!result) return res.status(404).json({ message: 'Role not found' });
    res.json(result);
  }

  static async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const result = await RoleService.deleteRole(id);
    if (!result) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted successfully' });
  }
}
