import { Sprint } from '../models/sprint.model';

export class SprintService {
  static async create(data: Partial<Sprint>) {
    return await Sprint.create(data);
  }

  static async getAll() {
    return await Sprint.findAll();
  }

  static async getById(id: number) {
    return await Sprint.findByPk(id);
  }

  static async update(id: number, data: Partial<Sprint>) {
    const sprint = await Sprint.findByPk(id);
    if (!sprint) return null;
    return await sprint.update(data);
  }

  static async delete(id: number) {
    const sprint = await Sprint.findByPk(id);
    if (!sprint) return null;
    await sprint.destroy();
    return sprint;
  }
}
