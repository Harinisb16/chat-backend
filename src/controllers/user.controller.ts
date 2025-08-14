import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Team } from '../models/team.model';
import { getIO } from '../config/socket.config';

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
    // Emit the user data over WebSocket
    const io = getIO(); // Get the Socket.IO server instance
    io.emit('user:created', user); // Broadcast to all connected client
    console.log('WebSocket event emitted:', user);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getAllUsers = async (_: Request, res: Response) => {
  const users = await User.findAll({ include: [Role] });
  res.json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id, { include: [Role] });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await user.update(req.body);
  res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  await user.destroy();
  res.json({ message: 'User deleted' });
};
export const assignUserToTeam = async (req: Request, res: Response) => {
  const { userId, teamId } = req.body;

  try {
    const user = await User.findByPk(userId);
    const team = await Team.findByPk(teamId);

    if (!user || !team) {
      return res.status(404).json({ error: 'User or Team not found' });
    }

    await user.$add('teams', teamId); 
    res.status(200).json({ message: 'User assigned to team' });
  } catch (err) {
    res.status(500).json({ error: 'Assignment failed' });
  }
};