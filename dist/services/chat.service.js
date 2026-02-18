"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markDelivered = exports.getUndeliveredMessages = exports.saveMessage = exports.getMessages = exports.getUsersForChat = exports.getAllUsers = void 0;
const db_1 = require("../config/db");
const sequelize_1 = require("sequelize");
const chatMessage_model_1 = __importDefault(require("../models/chatMessage.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const role_model_1 = __importDefault(require("../models/role.model"));
const getAllUsers = async () => {
    const users = await user_model_1.default.findAll();
    return users.map((u) => ({
        id: u.userId,
        name: u.username,
    }));
};
exports.getAllUsers = getAllUsers;
/* =========================================
   GET USERS FOR CHAT (ROLE BASED)
========================================= */
const getUsersForChat = async (currentUserRole) => {
    if (currentUserRole === "ADMIN") {
        // Admin sees USERS
        return await user_model_1.default.findAll({
            include: [
                {
                    model: role_model_1.default,
                    attributes: ["roleName"],
                    where: { roleName: "USER" },
                },
            ],
        });
    }
    if (currentUserRole === "USER") {
        // User sees ADMIN
        return await user_model_1.default.findAll({
            include: [
                {
                    model: role_model_1.default,
                    attributes: ["roleName"],
                    where: { roleName: "ADMIN" },
                },
            ],
        });
    }
    return [];
};
exports.getUsersForChat = getUsersForChat;
/* =========================================
   GET MESSAGES BETWEEN 2 USERS
========================================= */
const getMessages = async (userId, otherUserId) => {
    return await db_1.sequelize.query(`
    SELECT *
    FROM messages
    WHERE (senderId = :userId AND receiverId = :otherUserId)
       OR (senderId = :otherUserId AND receiverId = :userId)
    ORDER BY "createdAt" ASC
    `, {
        replacements: { userId, otherUserId },
        type: sequelize_1.QueryTypes.SELECT,
    });
};
exports.getMessages = getMessages;
/* =========================================
   SAVE MESSAGE
========================================= */
const saveMessage = async (senderId, receiverId, message) => {
    return await chatMessage_model_1.default.create({
        senderId,
        receiverId,
        message,
        delivered: false,
        mailSent: false,
    });
};
exports.saveMessage = saveMessage;
/* =========================================
   GET UNDELIVERED MESSAGES
========================================= */
const getUndeliveredMessages = async (userId) => {
    const messages = await chatMessage_model_1.default.findAll({
        where: {
            receiverId: userId,
            delivered: false,
        },
        order: [["createdAt", "ASC"]],
    });
    return messages.map((msg) => msg.toJSON());
};
exports.getUndeliveredMessages = getUndeliveredMessages;
/* =========================================
   MARK MESSAGE DELIVERED
========================================= */
const markDelivered = async (messageId) => {
    await chatMessage_model_1.default.update({ delivered: true }, { where: { id: messageId } });
};
exports.markDelivered = markDelivered;
