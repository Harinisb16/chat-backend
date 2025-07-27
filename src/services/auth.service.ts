import { Login } from '../models/login.model';
import bcrypt from 'bcryptjs';

export const registerUser = async (email: string, password: string) => {
  const existingUser = await Login.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);
  return await Login.create({ email, password: hashedPassword });
};

export const loginUser = async (email: string, password: string) => {
  const user = await Login.findOne({ where: { email } });
  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  return user;
};
