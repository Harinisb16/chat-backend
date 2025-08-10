import { Request, Response } from 'express';
import { teamleadService } from '../services/teamlead.service';

export class TeamLeadController {
static async create(req: Request, res: Response) {
    try {
      const { reportingManagerName, email } = req.body;

      if (typeof reportingManagerName !== 'string' || typeof email !== 'string') {
        return res.status(400).json({ error: 'Invalid input types' });
      }

      const user = await teamleadService.createTeamLead({ reportingManagerName, email });
      res.status(201).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
  static async getAll(req: Request, res: Response) {
    try {
      const users = await teamleadService.getAllTeamLead();
      res.status(200).json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const user = await teamleadService.getTeamLeadById(Number(req.params.id));
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await teamleadService.updateTeamLead(Number(req.params.id), req.body);
      res.status(200).json(updated);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const result = await teamleadService.deleteTeamLead(Number(req.params.id));
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
