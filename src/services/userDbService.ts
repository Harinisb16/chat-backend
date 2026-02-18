import { User } from "../models/user.model";
import { Role } from "../models/role.model";

export async function fetchAllUsers() {
  const users = await User.findAll({ include: [Role] });
  return users.map(u => ({
    id: u.userId,
    username: u.username,
    email: u.email,
    role: u.role ? u.role.role : null,
  }));
}

export async function fetchUserByUsername(username: string) {
  const user = await User.findOne({ where: { username }, include: [Role] });
  if (!user) return null;
  return {
      userId: user.userId,
    username: user.username,
    email: user.email,
    role: user.role ? user.role.role : null,
  };
}
