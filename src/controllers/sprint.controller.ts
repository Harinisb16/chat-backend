import { Request, Response } from 'express';
import { SprintService } from '../services/sprint.service';

export class SprintController {
  async create(req: Request, res: Response) {
    try {
      const sprint = await SprintService.create(req.body);
      res.status(201).json(sprint);
    } catch (err) {
      res.status(500).json({ message: 'Error creating sprint', error: err });
    }
  }

  async getAll(req: Request, res: Response) {
    const sprints = await SprintService.getAll();
    res.json(sprints);
  }

  async getById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const sprint = await SprintService.getById(id);
    if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
    res.json(sprint);
  }

  async update(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const sprint = await SprintService.update(id, req.body);
    if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
    res.json(sprint);
  }

  async delete(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const sprint = await SprintService.delete(id);
    if (!sprint) return res.status(404).json({ message: 'Sprint not found' });
    res.json({ message: 'Sprint deleted' });
  }
}

export const sprintController = new SprintController();
