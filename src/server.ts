// import http from "http";
// import { Server } from "socket.io";
// import app from "./app";
// import { saveMessage } from "./services/chat.service";

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });

// const generateRoom = (user1: number, user2: number) => {
//   return `chat_${Math.min(user1, user2)}_${Math.max(user1, user2)}`;
// };

// io.on("connection", (socket) => {
//   console.log("Connected:", socket.id);

//   // socket.on("joinRoom", ({ user1, user2 }) => {
//   //   const room = generateRoom(user1, user2);
//   //   socket.join(room);
//   //   console.log(`Joined: ${room}`);
//   // });
// socket.on("joinRoom", ({ user1, user2 }) => {
//   const room = generateRoom(user1, user2);
//   socket.join(room);

//   console.log(`Joined: ${room}`);
//   console.log("All rooms of socket:", socket.rooms);
// });

//   socket.on("leaveRoom", ({ user1, user2 }) => {
//     const room = generateRoom(user1, user2);
//     socket.leave(room);
//     console.log(`Left: ${room}`);
//   });

 
// // socket.on("sendMessage", ({ senderId, receiverId, message }) => {

// //   const room = [senderId, receiverId]
// //     .sort((a, b) => a - b)
// //     .join("_");

// //   io.to(`chat_${room}`).emit("receiveMessage", {
// //     senderId,
// //     receiverId,
// //     message
// //   });

// // });

// socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
//   const room = generateRoom(senderId, receiverId);

//    await saveMessage(
//     String(senderId),
//     String(receiverId),
//     message
//   );
  
//   io.to(room).emit("receiveMessage", {
//     senderId,
//     receiverId,
//     message,
//   });

//   console.log("Message sent to:", room);
// });

//   socket.on("disconnect", () => {
//     console.log("Disconnected:", socket.id);
//   });
// });

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });


// import http from "http";
// import { Server } from "socket.io";
// import app from "./app";
// import { saveMessage } from "./services/chat.service";

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [
//       "http://localhost:5173", // admin frontend
//       "http://localhost:5174", // widget frontend
//     ],
//     credentials: true,
//   },
// });

// /**
//  * 1️⃣ Generate 1-to-1 room
//  */
// const generateRoom = (user1: string, user2: string) => {
//   return `chat_${[user1, user2].sort().join("_")}`;
// };

// /**
//  * 2️⃣ Generate tenant-specific room
//  */
// const generateTenantRoom = (apiKey: string, userId: string) => {
//   return `tenant_${apiKey}_${userId}`;
// };

// io.on("connection", (socket) => {
//   console.log("Connected:", socket.id);

//   /**
//    * 🔹 Widget Join (Tenant Based)
//    */
//   socket.on("join", ({ apiKey, userId }) => {
//     const room = generateTenantRoom(apiKey, userId);
//     socket.join(room);

//     console.log(`Widget joined room: ${room}`);
//   });

//   /**
//    * 🔹 Admin Dashboard Join (1-to-1 Chat)
//    */
//   socket.on("joinRoom", ({ user1, user2 }) => {
//     const room = generateRoom(String(user1), String(user2));
//     socket.join(room);

//     console.log(`Joined 1-to-1 room: ${room}`);
//   });

//   /**
//    * 🔹 Leave Room
//    */
//   socket.on("leaveRoom", ({ user1, user2 }) => {
//     const room = generateRoom(String(user1), String(user2));
//     socket.leave(room);
//     console.log(`Left room: ${room}`);
//   });

//   /**
//    * 🔹 Send Message (Widget Tenant Mode)
//    */
// //   socket.on("sendMessage", async (data) => {
// //     const { apiKey, senderId, receiverId, message } = data;

// //     // If apiKey exists → Tenant mode
// //     if (apiKey) {
// //       const receiverRoom = generateTenantRoom(apiKey, receiverId);

// //      await saveMessage(
// //   Number(senderId),
// //   Number(receiverId),
// //   message
// // );


// //       io.to(receiverRoom).emit("receiveMessage", {
// //         senderId,
// //         receiverId,
// //         message,
// //       });

// //       console.log("Tenant message sent to:", receiverRoom);
// //       return;
// //     }

// //     // Otherwise → Normal 1-to-1 mode
// //     const room = generateRoom(String(senderId), String(receiverId));

// //     await saveMessage(
// //   Number(senderId),
// //   Number(receiverId),
// //   message
// // );


// //     io.to(room).emit("receiveMessage", {
// //       senderId,
// //       receiverId,
// //       message,
// //     });

// //     console.log("1-to-1 message sent to:", room);
// //   });
// socket.on("sendMessage", async (data) => {
//   const { apiKey, senderId, receiverId, message } = data;

//   const sender = parseInt(senderId, 10);
//   const receiver = parseInt(receiverId, 10);

//   if (isNaN(sender) || isNaN(receiver)) {
//     console.error("Invalid IDs received:", data);
//     return;
//   }

//   if (apiKey) {
//     const receiverRoom = generateTenantRoom(apiKey, String(receiver));

//     await saveMessage(sender, receiver, message);

//     io.to(receiverRoom).emit("receiveMessage", {
//       senderId: sender,
//       receiverId: receiver,
//       message,
//     });

//     return;
//   }

//   const room = generateRoom(String(sender), String(receiver));

//   await saveMessage(sender, receiver, message);

//   io.to(room).emit("receiveMessage", {
//     senderId: sender,
//     receiverId: receiver,
//     message,
//   });
// });

//   /**
//    * 🔹 Disconnect
//    */
//   socket.on("disconnect", () => {
//     console.log("Disconnected:", socket.id);
//   });
// });

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { saveMessage } from "./services/chat.service";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // admin frontend
      "http://localhost:5174", // widget frontend
      "https://chat-widget-three-eta.vercel.app"
    ],
    credentials: true,
  },
});

/**
 * ✅ Generate 1-to-1 Room
 * Always sorts IDs so chat_1_2 === chat_2_1
 */
const generateRoom = (user1: number, user2: number) => {
  const sorted = [user1, user2].sort((a, b) => a - b);
  return `chat_${sorted[0]}_${sorted[1]}`;
};

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  /**
   * ✅ Join 1-to-1 Chat Room
   */
  socket.on("joinRoom", ({ user1, user2 }) => {
    const u1 = Number(user1);
    const u2 = Number(user2);

    if (isNaN(u1) || isNaN(u2)) {
      console.error("Invalid joinRoom IDs:", { user1, user2 });
      return;
    }

    const room = generateRoom(u1, u2);
    socket.join(room);

    console.log("Joined 1-to-1 room:", room);
  });

  /**
   * ✅ Leave Room
   */
  socket.on("leaveRoom", ({ user1, user2 }) => {
    const u1 = Number(user1);
    const u2 = Number(user2);

    if (isNaN(u1) || isNaN(u2)) return;

    const room = generateRoom(u1, u2);
    socket.leave(room);

    console.log("Left room:", room);
  });

  /**
   * ✅ Send Message (Unified System)
   */
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    const sender = Number(senderId);
    const receiver = Number(receiverId);

    if (isNaN(sender) || isNaN(receiver)) {
      console.error("Invalid IDs received:", {
        senderId,
        receiverId,
      });
      return;
    }

    const room = generateRoom(sender, receiver);
console.log("Sending message to room:", room);

    try {
      await saveMessage(sender, receiver, message);

      io.to(room).emit("receiveMessage", {
        senderId: sender,
        receiverId: receiver,
        message,
      });

      console.log("Message sent to room:", room);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  /**
   * ✅ Disconnect
   */
  socket.on("disconnect", () => {
    console.log("Disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
