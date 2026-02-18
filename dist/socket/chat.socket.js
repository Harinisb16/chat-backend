"use strict";
// import { Server, Socket } from "socket.io";
// import ChatMessage from "../models/chatMessage.model";
// import * as chatService from "../services/chat.service";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initChatSocket = void 0;
const chatMessage_model_1 = __importDefault(require("../models/chatMessage.model"));
const chatService = __importStar(require("../services/chat.service"));
const onlineUsers = new Map();
const initChatSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);
        /* =================================================
           ROOM JOIN SYSTEM
        ================================================== */
        socket.on("join", (userId) => {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined room user_${userId}`);
        });
        socket.on("send_message", (data) => {
            const { senderId, receiverId, message } = data;
            io.to(`user_${receiverId}`).emit("receive_message", {
                senderId,
                receiverId,
                message,
            });
        });
        /* =================================================
           ONLINE TRACKING SYSTEM
        ================================================== */
        socket.on("user-online", async (userId) => {
            onlineUsers.set(userId, socket.id);
            try {
                const pendingMessages = await chatService.getUndeliveredMessages(userId);
                for (const msg of pendingMessages) {
                    socket.emit("receive-message", msg);
                    await chatService.markDelivered(msg.id);
                }
                io.emit("online-users", Array.from(onlineUsers.keys()));
            }
            catch (err) {
                console.error("Error fetching undelivered:", err);
            }
        });
        /* =================================================
           COMMON MESSAGE HANDLER (ADMIN + USER)
        ================================================== */
        const handleMessage = async (senderId, receiverId, message) => {
            const sender = Number(senderId);
            const receiver = Number(receiverId);
            const delivered = onlineUsers.has(receiverId);
            const newMessage = await chatMessage_model_1.default.create({
                senderId: sender,
                receiverId: receiver,
                message,
                delivered,
            });
            const receiverSocketId = onlineUsers.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive-message", newMessage);
            }
            return newMessage;
        };
        /* =================================================
           ADMIN SEND MESSAGE
        ================================================== */
        socket.on("admin-send-message", async ({ senderId, receiverId, message, }) => {
            try {
                await handleMessage(senderId, receiverId, message);
            }
            catch (err) {
                console.error("Error admin-send-message:", err);
            }
        });
        /* =================================================
           USER SEND MESSAGE
        ================================================== */
        socket.on("send-message", async ({ senderId, receiverId, message, }) => {
            try {
                await handleMessage(senderId, receiverId, message);
            }
            catch (err) {
                console.error("Error send-message:", err);
            }
        });
        /* =================================================
           DISCONNECT
        ================================================== */
        socket.on("disconnect", () => {
            for (const [userId, sockId] of onlineUsers.entries()) {
                if (sockId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit("online-users", Array.from(onlineUsers.keys()));
            console.log("User disconnected:", socket.id);
        });
    });
};
exports.initChatSocket = initChatSocket;
