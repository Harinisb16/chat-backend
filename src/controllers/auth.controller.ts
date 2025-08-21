import { Request, Response } from 'express';
import { registerUser, loginUser, getAllUserslogin } from '../services/auth.service';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role, roleId, firstName, lastName, phone, dob, gender } = req.body;
    const photo = req.file?.path; // multer saves file path here

    const user = await registerUser(
      username,
      email,
      password,
      Number(roleId),
      firstName,
      lastName,
      phone,
      dob,
      gender,
      photo || ""
    );

    res.status(201).json({
      message: "User registered successfully",
      user
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
      role: user.role,
      photo:user.photo
    });

    res.status(200).json({
      message: "Login successful",
      token,
      username: user.username,
      userId: user.id,
      email: user.email,
      role: user.role,
           photo:user.photo
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};


export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await getAllUserslogin();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
