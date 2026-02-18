// import { Server, Socket } from "socket.io";
// import ChatMessage from "../models/chatMessage.model";
// import * as chatService from "../services/chat.service";

// const onlineUsers = new Map<string, string>(); 
// // userId -> socketId

// export const initChatSocket = (io: Server) => {
//   io.on("connection", (socket: Socket) => {
//     console.log("User connected:", socket.id);

//     /* =========================
//        USER ONLINE
//     ========================== */
//     socket.on("user-online", async (userId: string) => {
//       onlineUsers.set(userId, socket.id);

//       // Get undelivered messages
//       const pendingMessages =
//         await chatService.getUndeliveredMessages(userId);

//       // Send pending messages
//       for (const msg of pendingMessages) {
//         socket.emit("receive-message", msg);
//         await chatService.markDelivered(msg.id);
//       }

//       // Broadcast online users
//       io.emit("online-users", Array.from(onlineUsers.keys()));
//     });

//     /* =========================
//        ADMIN SEND MESSAGE
//     ========================== */
//     socket.on(
//       "admin-send-message",
//       async ({
//         toUserId,
//         fromAdminId,
//         message,
//       }: {
//         toUserId: string;
//         fromAdminId: string;
//         message: string;
//       }) => {
//         const delivered = onlineUsers.has(toUserId);

//         const newMessage = await ChatMessage.create({
//           senderId: fromAdminId,
//           receiverId: toUserId,
//           message,
//           delivered,
//         });

//         const userSocketId = onlineUsers.get(toUserId);

//         if (userSocketId) {
//           io.to(userSocketId).emit("receive-message", newMessage);
//         }
//       }
//     );

//     /* =========================
//        USER SEND MESSAGE
//     ========================== */
//     socket.on(
//       "send-message",
//       async ({
//         senderId,
//         receiverId,
//         message,
//       }: {
//         senderId: string;
//         receiverId: string;
//         message: string;
//       }) => {
//         const delivered = onlineUsers.has(receiverId);

//         const newMessage = await ChatMessage.create({
//           senderId,
//           receiverId,
//           message,
//           delivered,
//         });

//         const receiverSocketId = onlineUsers.get(receiverId);

//         if (receiverSocketId) {
//           io.to(receiverSocketId).emit("receive-message", newMessage);
//         }
//       }
//     );

//     /* =========================
//        DISCONNECT
//     ========================== */
//     socket.on("disconnect", () => {
//       for (const [userId, sockId] of onlineUsers.entries()) {
//         if (sockId === socket.id) {
//           onlineUsers.delete(userId);
//           break;
//         }
//       }

//       io.emit("online-users", Array.from(onlineUsers.keys()));
//       console.log("User disconnected:", socket.id);
//     });
//   });
// };


import { Server, Socket } from "socket.io";
import ChatMessage from "../models/chatMessage.model";
import * as chatService from "../services/chat.service";

const onlineUsers = new Map<string, string>();

export const initChatSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    /* =================================================
       ROOM JOIN SYSTEM (Your Requested Code)
    ================================================== */
    socket.on("join", (userId: number) => {
      socket.join(`user_${userId}`);
      console.log(`User ${userId} joined room user_${userId}`);
    });

    socket.on("send_message", (data) => {
      const { senderId, receiverId, message } = data;

      console.log("Room Message:", data);

      io.to(`user_${receiverId}`).emit("receive_message", {
        senderId,
        receiverId,
        message,
      });
    });

    /* =================================================
       ONLINE TRACKING SYSTEM
    ================================================== */
    socket.on("user-online", async (userId: string) => {
      onlineUsers.set(userId, socket.id);

      try {
        const pendingMessages =
          await chatService.getUndeliveredMessages(userId);

        for (const msg of pendingMessages) {
          socket.emit("receive-message", msg);
          await chatService.markDelivered(msg.id);
        }

        io.emit("online-users", Array.from(onlineUsers.keys()));
      } catch (err) {
        console.error("Error fetching undelivered:", err);
      }
    });

    /* =================================================
       ADMIN SEND MESSAGE (DB STORED)
    ================================================== */
    socket.on(
      "admin-send-message",
      async ({
        senderId,
        receiverId,
        message,
      }: {
        senderId: string;
        receiverId: string;
        message: string;
      }) => {
        try {
          const delivered = onlineUsers.has(receiverId);

          const newMessage = await ChatMessage.create({
            senderId,
            receiverId,
            message,
            delivered,
          });

          const receiverSocketId = onlineUsers.get(receiverId);

          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive-message", newMessage);
          }
        } catch (err) {
          console.error("Error admin-send-message:", err);
        }
      }
    );

    /* =================================================
       USER SEND MESSAGE (DB STORED)
    ================================================== */
    socket.on(
      "send-message",
      async ({
        senderId,
        receiverId,
        message,
      }: {
        senderId: string;
        receiverId: string;
        message: string;
      }) => {
        try {
          const delivered = onlineUsers.has(receiverId);

          const newMessage = await ChatMessage.create({
            senderId,
            receiverId,
            message,
            delivered,
          });

          const receiverSocketId = onlineUsers.get(receiverId);

          if (receiverSocketId) {
            io.to(receiverSocketId).emit("receive-message", newMessage);
          }
        } catch (err) {
          console.error("Error send-message:", err);
        }
      }
    );

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
