"use strict";
// // import { Server } from "socket.io";
// // import http from "http";
// // import User from "../models/user.model";
// // import ChatMessage from "../models/chatMessage.model";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
// // let io: Server;
// // export const initSocket = (server: http.Server) => {
// //   io = new Server(server, {
// //     cors: { origin: "*" },
// //   });
// //   io.on("connection", async (socket) => {
// //     const userId = Number(socket.handshake.query.userId);
// //     if (!isNaN(userId)) {
// //       await User.update(
// //         { isOnline: true },
// //         { where: { userId } }   
// //       );
// //       console.log(`User ${userId} connected`);
// //     }
// //     socket.on("disconnect", async () => {
// //       if (!isNaN(userId)) {
// //         await User.update(
// //           { isOnline: false },
// //           { where: { userId } } 
// //         );
// //         console.log(`User ${userId} disconnected`);
// //       }
// //     });
// //   });
// // };
// // export const getIO = (): Server => {
// //   if (!io) throw new Error("Socket.io not initialized");
// //   return io;
// // };
// import { Server } from "socket.io";
// import http from "http";
// import User from "../models/user.model";
// import ChatMessage from "../models/chatMessage.model";
// import { sendOfflineMailIfNeeded } from "../services/chat.service";
// let io: Server;
// export const initSocket = (server: http.Server) => {
//   io = new Server(server, {
//     cors: { origin: "*" },
//   });
//   io.on("connection", async (socket) => {
//     const userId = Number(socket.handshake.query.userId);
//     if (isNaN(userId)) {
//       console.log("Invalid userId, disconnecting...");
//       socket.disconnect();
//       return;
//     }
//     // Join a private room using userId
//     socket.join(`user_${userId}`);
//     // Mark user online
//     await User.update({ isOnline: true }, { where: { userId } });
//     console.log(`User ${userId} connected`);
//     // 📩 SEND MESSAGE
//     socket.on("sendMessage", async (data) => {
//       try {
//         const { senderId, receiverId, message } = data;
//         // Save message to DB
//         const msg = await ChatMessage.create({ senderId, receiverId, message });
//         const receiver = await User.findOne({ where: { userId: receiverId } });
//         if (receiver?.dataValues.isOnline) {
//           // Send only to receiver room
//           io.to(`user_${receiverId}`).emit("receiveMessage", msg);
//         } else {
//           // Offline → email logic
//           await sendOfflineMailIfNeeded(msg);
//         }
//       } catch (err) {
//         console.error("Message error:", err);
//       }
//     });
//     // ❌ DISCONNECT
//     socket.on("disconnect", async () => {
//       await User.update({ isOnline: false }, { where: { userId } });
//       console.log(`User ${userId} disconnected`);
//     });
//   });
// };
// export const getIO = (): Server => {
//   if (!io) throw new Error("Socket.io not initialized");
//   return io;
// };
// import { Server } from "socket.io";
// import http from "http";
// let io: Server;
// let onlineUsers: string[] = [];
// let socketUserMap: { [key: string]: string } = {}; //  socket.id -> userId
// export const initSocket = (server: http.Server) => {
//   io = new Server(server, {
//     cors: {
//       origin: "http://localhost:5173",
//       methods: ["GET", "POST"],
//       credentials: true,
//     },
//     // transports: ["websocket", "polling"],
//   });
//   io.on("connection", (socket) => {
//     console.log("User connected:", socket.id);
//     // USER JOINS
//     socket.on("join", (userId: string) => {
//       if (!userId || userId === "undefined") return;
//       socketUserMap[socket.id] = userId; // map socket to user
//       if (!onlineUsers.includes(userId)) {
//         onlineUsers.push(userId);
//       }
//       io.emit("onlineUsers", onlineUsers);
//       console.log("Online users:", onlineUsers);
//     });
//     //  DISCONNECT FIX
//     socket.on("disconnect", () => {
//       console.log("User disconnected:", socket.id);
//       const userId = socketUserMap[socket.id]; // get correct user
//       delete socketUserMap[socket.id];
//       if (userId) {
//         onlineUsers = onlineUsers.filter((id) => id !== userId);
//         io.emit("onlineUsers", onlineUsers);
//       }
//     });
//   });
// };
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
let io;
let onlineUsers = [];
// socket.id -> userId (optional helper map)
let socketUserMap = {};
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token) {
                return next(new Error("No token provided"));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.user = decoded; //  THIS IS KEY
            next();
        }
        catch (err) {
            next(new Error("Authentication error"));
        }
    });
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);
        //  IMPORTANT:
        // `socket.user` must be attached in middleware (shown below)
        const user = socket.user;
        if (!user) {
            console.log("No user found on socket, disconnecting");
            socket.disconnect();
            return;
        }
        const onlineUser = {
            userId: user.userId,
            role: user.role,
            socketId: socket.id,
        };
        onlineUsers.push(onlineUser);
        socketUserMap[socket.id] = user.userId;
        io.emit("online-users", onlineUsers);
        // USER DISCONNECTS
        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
            delete socketUserMap[socket.id];
            io.emit("online-users", onlineUsers);
        });
    });
};
exports.initSocket = initSocket;
// Optional helper
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
};
exports.getIO = getIO;
