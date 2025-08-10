import { Request, Response } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    let { username, email, password, role, roleId } = req.body;

    // Map `role` to `roleId` if only role is sent
    if (!roleId && role) {
      roleId = parseInt(role, 10);
      if (isNaN(roleId)) throw new Error('Invalid role format');
    }

    const user = await registerUser(username, email, password, roleId);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        roleId: user.roleId
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await loginUser(email, password);

    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      userId: user.id,
      email: user.email,
      role: user.role
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};
