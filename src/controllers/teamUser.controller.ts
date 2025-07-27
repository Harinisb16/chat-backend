import { Request, Response } from 'express';
import { createTeamUser, getAllTeamUsers } from '../services/teamUser.service';

export const createTeamUserController = async (req: Request, res: Response) => {
  try {
    const { userIds, teamId, projectId } = req.body;

    if (!Array.isArray(userIds) || !teamId || !projectId) {
      return res.status(400).json({ error: 'Invalid input. Provide userIds, teamId, and projectId' });
    }

    const response = await createTeamUser(userIds, teamId, projectId);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team user', message: (error as Error).message });
  }
};

export const getAllTeamUsersController = async (_req: Request, res: Response) => {
  try {
    const data = await getAllTeamUsers();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team users', message: (error as Error).message });
  }
};
