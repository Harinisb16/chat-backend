import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import {
  registerUser,
  loginUser as loginUserService,
  getAllUserslogin,
} from "../services/auth.service";
import User from "../models/user.model";
import { JwtUserPayload } from "../types";

/* 🔐 Extended Request */
export interface AuthRequest extends Request {
  user?: JwtUserPayload;
}

/* ================= REGISTER ================= */
export const register = async (req: Request, res: Response) => {
  try {
    const {
      username,
      email,
      password,
      roleId,
      firstName,
      lastName,
      phone,
      dob,
      gender,
    } = req.body;

    const photo = req.file?.path || "";

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
      photo
    );

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

/* ================= LOGIN ================= */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const loginUser = await loginUserService(email, password);

    const user = await User.findByPk(loginUser.userId);
    if (!user) {
      return res.status(404).json({ error: "User record not found" });
    }

    /* Mark user online */
    await user.update({
      isOnline: true,
      lastLogin: new Date(),
      offlineNotified: false,
    });

    /* 🔑 Generate JWT */
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: loginUser.role, // ✅ safest source
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      token,
      user: {
        userId: user.userId,
        username: user.username,
        email: user.email,
        role: loginUser.role,
      },
    });
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
};

/* ================= LOGOUT ================= */
export const logoutUser = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ isOnline: false });

    res.json({ message: "Logged out successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= MARK ONLINE ================= */
export const markOnline = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ isOnline: true });

    res.json({ message: "User marked online", user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= GET ALL USERS ================= */
export const getAll = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUserslogin();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
