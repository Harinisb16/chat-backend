import bcrypt from "bcryptjs";
import User from "../models/user.model";
import { Login } from "../models/login.model";
import { UserRole } from "../models/userrole.model";

export interface LoginResponse {
  id: number;
  userId: number;
  username: string;
  email: string;
  role: string;
  photo: string;
}

// ================= REGISTER USER =================
export const registerUser = async (
  username: string,
  email: string,
  password: string,
  roleId: number,
  firstName: string,
  lastName: string,
  phone: string,
  dob: string,
  gender: string,
  photo: string
) => {
  // Check if email already exists
  const existingUser = await Login.findOne({ where: { email } });
  if (existingUser) throw new Error("User already exists");

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // STEP 1 — Create User
  const newUser = await User.create({
    username,
    email,
    phone,
    roleId,
    isOnline: false,
  });

  // STEP 2 — Create Login row linked to User
  const loginRecord = await Login.create({
    username,
    email,
    password: hashedPassword,
    roleId,
    userId: newUser.userId, // FK reference
    firstName,
    lastName,
    phone,
    dob,
    gender,
    photo,
  });

  return loginRecord;
};

// ================= LOGIN USER =================
export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const login = await Login.findOne({
    where: { email },
    include: [{ model: UserRole, attributes: ["role"] }],
  });

  if (!login) throw new Error("Invalid email or password");

  const isMatch = await bcrypt.compare(password, login.password);
  if (!isMatch) throw new Error("Invalid email or password");

  return {
    id: login.id,
    userId: login.userId,
    username: login.username,
    email: login.email,
    role: login.UserRole?.role || "User",
    photo: login.photo,
  };
};

// ================= GET ALL USERS =================
export const getAllUserslogin = async () => {
  return await Login.findAll({
    attributes: [
      "id",
      "userId",
      "username",
      "firstName",
      "lastName",
      "phone",
      "dob",
      "gender",
      "photo",
      "email",
      "roleId",
    ],
    include: [{ model: UserRole, attributes: ["role"] }],
  });
};
