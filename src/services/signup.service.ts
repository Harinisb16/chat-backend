// signup.service.ts
import { Signup } from "../models/signup.model";

export class SignupService {
  // Create new user

async createUser(data: Partial<Signup>): Promise<Signup> {
  return await Signup.create(data as any); // quick fix, but not type-safe
}

  // Get all users
  async getAllUsers(): Promise<Signup[]> {
    return await Signup.findAll();
  }

  // Get user by ID
  async getUserById(id: number): Promise<Signup | null> {
    return await Signup.findByPk(id);
  }

  // Update user
  async updateUser(id: number, data: Partial<Signup>): Promise<[number, Signup[]]> {
    return await Signup.update(data, {
      where: { id },
      returning: true,
    });
  }

  // Delete user
  async deleteUser(id: number): Promise<number> {
    return await Signup.destroy({
      where: { id },
    });
  }
}
