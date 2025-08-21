// signup.controller.ts
import { Request, Response } from "express";
import { SignupService } from "../services/signup.service";

const signupService = new SignupService();

export class SignupController {
  // Create user
// Controller
  async create(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, phone, dob, gender, password } = req.body;

      // file upload
      let photoPath = null;
      if (req.file) {
        photoPath = req.file.path; // "uploads/xxxx.png"
      }

      const newUser = await signupService.createUser({
        firstName,
        lastName,
        email,
        phone,
        dob,
        gender,
        password,
        photo: photoPath,
      });

      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }



  // Get all users
  async findAll(req: Request, res: Response) {
    try {
      const users = await signupService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get user by id
  async findOne(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const user = await signupService.getUserById(id);
      if (!user) return res.status(404).json({ message: "User not found" });
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Update user
  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const [count, updatedUsers] = await signupService.updateUser(id, req.body);
      if (count === 0) return res.status(404).json({ message: "User not found" });
      res.json(updatedUsers[0]);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete user
  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const deleted = await signupService.deleteUser(id);
      if (!deleted) return res.status(404).json({ message: "User not found" });
      res.json({ message: "User deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
