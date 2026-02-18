import type { Message } from "../types/message";
import { sequelize } from "../config/db";
import { QueryTypes } from "sequelize";
import ChatMessage from "../models/chatMessage.model";
import User from "../models/user.model";
import Role from "../models/role.model";

export const getAllUsers = async () => {
  const users = await User.findAll();

  return users.map((u) => ({
    id: u.userId,
    name: u.username,
  }));
};

/* =========================================
   GET USERS FOR CHAT (ROLE BASED)
========================================= */
export const getUsersForChat = async (currentUserRole: string) => {
  if (currentUserRole === "ADMIN") {
    // Admin sees USERS
    return await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["roleName"],
          where: { roleName: "USER" },
        },
      ],
    });
  }

  if (currentUserRole === "USER") {
    // User sees ADMIN
    return await User.findAll({
      include: [
        {
          model: Role,
          attributes: ["roleName"],
          where: { roleName: "ADMIN" },
        },
      ],
    });
  }

  return [];
};

/* =========================================
   GET MESSAGES BETWEEN 2 USERS
========================================= */
export const getMessages = async (
  userId: number,
  otherUserId: number
) => {
  return await sequelize.query(
    `
    SELECT *
    FROM messages
    WHERE (senderId = :userId AND receiverId = :otherUserId)
       OR (senderId = :otherUserId AND receiverId = :userId)
    ORDER BY "createdAt" ASC
    `,
    {
      replacements: { userId, otherUserId },
      type: QueryTypes.SELECT,
    }
  );
};

/* =========================================
   SAVE MESSAGE
========================================= */
export const saveMessage = async (
  senderId: number,
  receiverId: number,
  message: string
) => {
  return await ChatMessage.create({
    senderId,
    receiverId,
    message,
    delivered: false,
    mailSent: false,
  });
};

/* =========================================
   GET UNDELIVERED MESSAGES
========================================= */
export const getUndeliveredMessages = async (
  userId: string
): Promise<Message[]> => {
  const messages = await ChatMessage.findAll({
    where: {
      receiverId: userId,
      delivered: false,
    },
    order: [["createdAt", "ASC"]],
  });

  return messages.map((msg) => msg.toJSON()) as Message[];
};

/* =========================================
   MARK MESSAGE DELIVERED
========================================= */
export const markDelivered = async (messageId: number) => {
  await ChatMessage.update(
    { delivered: true },
    { where: { id: messageId } }
  );
};
