import { Login } from '../models/login.model';
import { UserRole } from '../models/userrole.model';
import bcrypt from 'bcryptjs';

export const registerUser = async (
  username: string,
  email: string,
  password: string,
  roleId: number
) => {
  const existingUser = await Login.findOne({ where: { email } });
  if (existingUser) throw new Error('User already exists');

  const hashedPassword = await bcrypt.hash(password, 10);

  return await Login.create({
    username,
    email,
    password: hashedPassword,
    roleId
  });
};

export const loginUser = async (email: string, password: string) => {
  const user = await Login.findOne({
    where: { email },
    include: [{ model: UserRole, attributes: ['role'] }]
  });

  if (!user) throw new Error('Invalid email or password');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid email or password');

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role.role // comes from tbl_user_role
  };
};
