"use strict";
// // 
// import { Request, Response } from 'express';
// import { User } from '../models/user.model';
// import { Role } from '../models/role.model';
// import { Team } from '../models/team.model';
// import { getIO } from '../config/socket.config';
// import { sendEmail } from '../utils/emailService';
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyOfflineUsers = exports.notifyOfflineUsersBackend = exports.logoutUser = exports.loginUser = exports.assignUserToTeam = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = exports.createUser = void 0;
const user_model_1 = require("../models/user.model");
const role_model_1 = require("../models/role.model");
const team_model_1 = require("../models/team.model");
const socket_config_1 = require("../config/socket.config");
const emailService_1 = require("../utils/emailService");
// ------------------- CREATE USER -------------------
const createUser = async (req, res) => {
    try {
        const user = await user_model_1.User.create(req.body);
        res.status(201).json(user);
        // Emit WebSocket event to all connected clients
        const io = (0, socket_config_1.getIO)();
        io.emit("user:created", user);
        console.log("WebSocket event emitted for user:", user.username);
    }
    catch (err) {
        console.error("Error creating user:", err);
        res.status(400).json({ error: err });
    }
};
exports.createUser = createUser;
// ------------------- GET ALL USERS -------------------
const getAllUsers = async (_, res) => {
    try {
        const users = await user_model_1.User.findAll({ include: [role_model_1.Role] });
        res.json(users);
    }
    catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};
exports.getAllUsers = getAllUsers;
// ------------------- GET USER BY ID -------------------
const getUserById = async (req, res) => {
    try {
        const user = await user_model_1.User.findByPk(req.params.id, { include: [role_model_1.Role] });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch (err) {
        console.error("Error fetching user:", err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
};
exports.getUserById = getUserById;
// ------------------- UPDATE USER -------------------
const updateUser = async (req, res) => {
    try {
        const user = await user_model_1.User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        await user.update(req.body);
        res.json(user);
    }
    catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Failed to update user" });
    }
};
exports.updateUser = updateUser;
// ------------------- DELETE USER -------------------
const deleteUser = async (req, res) => {
    try {
        const user = await user_model_1.User.findByPk(req.params.id);
        if (!user)
            return res.status(404).json({ error: "User not found" });
        await user.destroy();
        res.json({ message: "User deleted" });
    }
    catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Failed to delete user" });
    }
};
exports.deleteUser = deleteUser;
// ------------------- ASSIGN USER TO TEAM -------------------
const assignUserToTeam = async (req, res) => {
    const { userId, teamId } = req.body;
    try {
        const user = await user_model_1.User.findByPk(userId);
        const team = await team_model_1.Team.findByPk(teamId);
        if (!user || !team) {
            return res.status(404).json({ error: "User or Team not found" });
        }
        await user.$add('teams', teamId);
        res.status(200).json({ message: "User assigned to team" });
    }
    catch (err) {
        console.error("Error assigning user to team:", err);
        res.status(500).json({ error: "Assignment failed" });
    }
};
exports.assignUserToTeam = assignUserToTeam;
const loginUser = async (req, res) => {
    try {
        const userId = req.user.userId; //  CORRECT FIELD
        // from JWT middleware
        const user = await user_model_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        console.log("LOGIN SECRET:", process.env.JWT_SECRET);
        await user.update({
            isOnline: true,
            lastLogin: new Date(),
            offlineNotified: false //  reset when session starts
        });
        console.log(` User logged in: ${user.username}`);
        res.json({ message: "Login success, user is now online" });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed" });
    }
};
exports.loginUser = loginUser;
// export const logoutUser = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).user.userId;
//     let user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     // 🔥 CHECK FLAG BEFORE CHANGING ANYTHING
//     const shouldSendEmail = !user.offlineNotified;
//     await user.update({
//       isOnline: false,
//       lastLogin: new Date(),
//     });
//     if (shouldSendEmail) {
//       const emailBody = `
// Hello ${user.username},
// You have logged out and are now OFFLINE.
// 📧 Email: ${user.email}
// 📱 Phone: ${user.phone ?? "N/A"}
// 🕒 Last Login: ${user.lastLogin ?? "N/A"}
// Regards,
// Admin Team
//       `;
//       await sendEmail(user.email, "You are now offline", emailBody);
//       await user.update({ offlineNotified: true });
//       console.log("✅ Offline email sent to", user.email);
//     } else {
//       console.log("⏭ Email already sent earlier, skipping...");
//     }
//     res.json({ message: "Logout success" });
//   } catch (error) {
//     console.error("Logout error:", error);
//     res.status(500).json({ message: "Logout failed" });
//   }
// };
// export const notifyOfflineUsersBackend = async (): Promise<number> => {
//   console.log("⏰ Running offline email check...");
//   // Fetch offline users who haven't been notified
//   const offlineUsers = await User.findAll({
//     where: {
//       isOnline: false,
//       offlineNotified: false,
//     },
//   });
//   console.log(`🔍 Found ${offlineUsers.length} offline users`);
//   let sentCount = 0;
//   for (const user of offlineUsers) {
//     console.log(`✉️ Sending email to: ${user.email} (username: ${user.username})`);
//     const emailBody = `
// Hello ${user.username},
// You are currently offline.
// 📧 Email: ${user.email}
// 📱 Phone: ${user.phone ?? "N/A"}
// 🕒 Last Login: ${user.lastLogin ?? "N/A"}
// Regards,
// Admin Team
//     `;
//     const success = await sendEmail(user.email, "You are now offline", emailBody);
//     if (success) {
//       await user.update({ offlineNotified: true });
//       console.log(`✅ Marked ${user.email} as notified`);
//       sentCount++;
//     } else {
//       console.log(`❌ Failed to send email to ${user.email}, will retry next interval`);
//     }
//   }
//   return sentCount;
// };
// export const logoutUser = async (req: Request, res: Response) => {
//   try {
//     const userId = (req as any).user.userId;
//     console.log(" Logout endpoint HIT");
//     console.log("JWT PAYLOAD:", (req as any).user);
//     const user = await User.findByPk(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });
//     //  Only proceed if user was actually online
//     if (!user.isOnline) {
//       return res.json({ message: "User already offline" });
//     }
//     //  Mark offline
//     await user.update({
//       isOnline: false,
//       offlineNotified: false  //  RESET FLAG FOR NEXT SESSION
//     });
//     console.log(" User marked offline:", user.email);
//     //  Prepare Email
//     const emailBody = `
// Hello ${user.username},
// You have logged out and are now OFFLINE.
// 📧 Email: ${user.email}
// 📱 Phone: ${user.phone ?? "N/A"}
// 🕒 Last Login: ${user.lastLogin ?? "N/A"}
// Regards,  
// Admin Team
//     `;
//     //  Send Email
//     await sendEmail(user.email, "You are now offline", emailBody);
//     //  Mark email sent
//     await user.update({ offlineNotified: true });
//     console.log(" Offline email sent to:", user.email);
//     res.json({ message: "Logout success & offline email sent" });
//   } catch (error) {
//     console.error(" Logout error:", error);
//     res.status(500).json({ message: "Logout failed" });
//   }
// };
const logoutUser = async (req, res) => {
    try {
        console.log("Logout endpoint HIT");
        // ✅ SAFE ACCESS
        const userPayload = req.user;
        if (!userPayload) {
            return res.status(401).json({ message: "Unauthorized - No user data" });
        }
        const userId = userPayload.userId;
        console.log("JWT PAYLOAD:", userPayload);
        const user = await user_model_1.User.findByPk(userId);
        if (!user)
            return res.status(404).json({ message: "User not found" });
        if (!user.isOnline) {
            return res.json({ message: "User already offline" });
        }
        await user.update({
            isOnline: false,
            offlineNotified: false
        });
        console.log("User marked offline:", user.email);
        const emailBody = `
Hello ${user.username},

You have logged out and are now OFFLINE.

📧 Email: ${user.email}
📱 Phone: ${user.phone ?? "N/A"}
🕒 Last Login: ${user.lastLogin ?? "N/A"}

Regards,  
Admin Team
    `;
        await (0, emailService_1.sendEmail)(user.email, "You are now offline", emailBody);
        await user.update({ offlineNotified: true });
        console.log("Offline email sent to:", user.email);
        res.json({ message: "Logout success & offline email sent" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Logout failed", error });
    }
};
exports.logoutUser = logoutUser;
const notifyOfflineUsersBackend = async () => {
    const allUsers = await user_model_1.User.findAll();
    console.log("All users in DB:", allUsers.map(u => ({
        id: u.userId,
        email: u.email,
        isOnline: u.isOnline,
        offlineNotified: u.offlineNotified
    })));
    const offlineUsers = allUsers.filter(u => u.isOnline === false && u.offlineNotified === false);
    console.log("Offline users to notify:", offlineUsers);
    for (const user of offlineUsers) {
        await (0, emailService_1.sendEmail)(user.email, "We noticed you are offline", `Hello ${user.username},\n\nYou are offline.\nLast Login: ${user.lastLogin ?? "N/A"}`);
        await user.update({ offlineNotified: true });
    }
    return offlineUsers.length;
};
exports.notifyOfflineUsersBackend = notifyOfflineUsersBackend;
// ------------------- EXPRESS ROUTE VERSION -------------------
const notifyOfflineUsers = async (_, res) => {
    try {
        const count = await (0, exports.notifyOfflineUsersBackend)();
        res.json({ message: `Email sent to ${count} offline users.` });
    }
    catch (err) {
        console.error("Error sending offline emails:", err);
        res.status(500).json({ error: "Failed to send emails" });
    }
};
exports.notifyOfflineUsers = notifyOfflineUsers;
