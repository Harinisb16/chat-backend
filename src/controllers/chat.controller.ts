// chat.controller.ts
import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import { sequelize } from "../config/db";
import User from "../models/user.model";
import { Role } from "../models/role.model";

// Fetch chats for a user
// export const fetchChatsForUser = async (req: Request, res: Response) => {
//   const userId = Number(req.query.userId);

//   if (!userId || isNaN(userId) || userId <= 0) {
//     return res.status(400).json({ message: "Invalid userId" });
//   }

//   try {
//     // Check if user exists
//    const currentUser: any = await sequelize.query(
//   `SELECT "userId", "roleId" FROM "tbl_user" WHERE "userId" = :userId`,
//   {
//     replacements: { userId },
//     type: QueryTypes.SELECT,
//   }
// );


//     if (!currentUser.length) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const role = currentUser[0].role.toLowerCase();
//     let chats;

//     // if (role === "admin") {
//     //   // Admin sees all normal users
//     //   chats = await sequelize.query(
//     //     `SELECT id, username AS name FROM users WHERE role != 'admin'`,
//     //     { type: QueryTypes.SELECT }
//     //   );
//     // } else {
//     //   // Normal user sees admin only
//     //   chats = await sequelize.query(
//     //     `SELECT id, username AS name FROM users WHERE role = 'admin'`,
//     //     { type: QueryTypes.SELECT }
//     //   );
//     // }

//     if (role === "admin") {
//   // Admin sees all normal users
//   chats = await sequelize.query(
//     `SELECT id, username AS name FROM users WHERE role != 'admin'`,
//     { type: QueryTypes.SELECT }
//   );
// } else {
//   // Normal user sees admin only
//   chats = await sequelize.query(
//     `SELECT id, username AS name FROM users WHERE LOWER(role) != 'admin'`,
//     { type: QueryTypes.SELECT }
//   );
// }

//     // Ensure admin chat exists in the list
//     const adminId = 1;
//     const hasAdminChat = chats.some((c: any) => c.id === adminId);
//     if (!hasAdminChat) {
//       chats.unshift({ id: adminId, name: "Admin" });
//     }

//     res.json({ chats });
//   } catch (error) {
//     console.error("Fetch chats error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// export const fetchChatsForUser = async (req: Request, res: Response) => {
//   const userId = Number(req.query.userId);

//   if (!userId || isNaN(userId) || userId <= 0) {
//     return res.status(400).json({ message: "Invalid userId" });
//   }

//   try {
//     // Get current user
//     const currentUser: any = await sequelize.query(
//       `SELECT id, "roleId"
// FROM "tbl_user"
// WHERE id = :userId
// `,
//       {
//         replacements: { userId },
//         type: QueryTypes.SELECT,
//       }
//     );

//     if (!currentUser.length) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const roleId = currentUser[0].roleId;

//     let chats;

//     // 🔥 If ADMIN
//     if (roleId === 1) {
//       chats = await sequelize.query(
//         `
//         SELECT "userId" as id, username as name
//         FROM "tbl_user"
//         WHERE "roleId" != 1
//         `,
//         { type: QueryTypes.SELECT }
//       );
//     } 
//     // 🔥 If NORMAL USER
//     else {
//       chats = await sequelize.query(
//         `
//         SELECT "userId" as id, username as name
//         FROM "tbl_user"
//         WHERE "roleId" = 1
//         `,
//         { type: QueryTypes.SELECT }
//       );
//     }

//     res.json({ chats });

//   } catch (error) {
//     console.error("Fetch chats error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const fetchChatsForUser = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const { userId } = req.query;

//     if (!userId) {
//       res.status(400).json({ message: "userId is required" });
//       return;
//     }

//     const userIdNum = Number(userId);

//     const user = await sequelize.query(
//       `SELECT "userId", "roleId"
//        FROM "tbl_user"
//        WHERE "userId" = :userId`,
//       {
//         replacements: { userId: userIdNum },
//         type: QueryTypes.SELECT,
//       }
//     );

//     if (!user.length) {
//       res.status(404).json({ message: "User not found" });
//       return;
//     }

//     res.json({ chats: [] }); // temporary test
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
export const fetchChatsForUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.query;

    if (!userId) {
      res.status(400).json({ message: "userId is required" });
      return;
    }

    const userIdNum = Number(userId);

    // 1️⃣ Get logged user
    const users: any = await sequelize.query(
      `SELECT "userId", "roleId"
       FROM "tbl_user"
       WHERE "userId" = :userId`,
      {
        replacements: { userId: userIdNum },
        type: QueryTypes.SELECT,
      }
    );

    if (!users.length) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const loggedUser = users[0];

    let chats;

    // 2️⃣ If Admin (roleId = 1)
    if (loggedUser.roleId === 1) {
      chats = await sequelize.query(
        `SELECT "userId" as id, "username" as name
         FROM "tbl_user"
         WHERE "roleId" != 1`,
        { type: QueryTypes.SELECT }
      );
    } else {
      // 3️⃣ If normal user → show admins
      chats = await sequelize.query(
        `SELECT "userId" as id, "username" as name
         FROM "tbl_user"
         WHERE "roleId" = 1`,
        { type: QueryTypes.SELECT }
      );
    }

    res.json({ chats });
  } catch (err) {
    console.error("Fetch chats error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch all users (for admin view)
// export const fetchUsers = async (req: Request, res: Response) => {
//   try {
//     const users = await sequelize.query(
//       `SELECT id, username AS name, role FROM users`,
//       { type: QueryTypes.SELECT }
//     );
//     res.json(users);
//   } catch (error) {
//     console.error("FETCH USERS ERROR:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// Fetch messages between admin and user
export const fetchMessages = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.userId);
    const adminId = Number(req.params.adminId);

    if (isNaN(userId) || isNaN(adminId)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    // const messages = await sequelize.query(
    //   `SELECT * FROM messages
    //    WHERE (senderid = :userId AND receiverid = :adminId)
    //       OR (senderid = :adminId AND receiverid = :userId)
    //    ORDER BY created_at ASC`,
    //   { replacements: { userId, adminId }, type: QueryTypes.SELECT }
    // );
// chat.controller.ts
const messages = await sequelize.query(
  `
  SELECT * FROM "messages"
  WHERE ("senderId" = :userId AND "receiverId" = :adminId)
     OR ("senderId" = :adminId AND "receiverId" = :userId)
  ORDER BY "createdAt" ASC
  `,
  {
    replacements: {
      userId,
      adminId,
    },
    type: QueryTypes.SELECT,
  }
);


    res.json(messages);
  } catch (error) {
    console.error("Fetch messages error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
// export const getAdmin = async (req: Request, res: Response) => {
//   try {
//     const admin = await User.findOne({
//       where: { role: "Admin" },
//       attributes: ["id", "username"],
//     });

//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     res.json({
//       id: admin.id.toString(),
//       name: admin.username,
//     });
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching admin" });
//   }
// };

// Optional: fetch messages between any two users
// export const fetchMessagesBetweenUsers = async (req: Request, res: Response) => {
//   try {
//     const user1 = Number(req.params.user1);
//     const user2 = Number(req.params.user2);

//     if (isNaN(user1) || isNaN(user2)) {
//       return res.status(400).json({ message: "Invalid user IDs" });
//     }

//     const messages = await sequelize.query(
//       `SELECT * FROM messages
//        WHERE (senderid = :user1 AND receiverid = :user2)
//           OR (senderid = :user2 AND receiverid = :user1)
//        ORDER BY created_at ASC`,
//       { replacements: { user1, user2 }, type: QueryTypes.SELECT }
//     );

//     res.json(messages);
//   } catch (error) {
//     console.error("Fetch messages between users error:", error);
//     res.status(500).json({ message: "Failed to fetch messages" });
//   }
// };
// export const getAdmin = async (req: Request, res: Response) => {
//   try {
//     const admin = await User.findOne({
//       include: [
//         {
//           model: Role,
//           where: { name: "Admin" }, // <-- make sure column name in Role table is correct
//         },
//       ],
//     });

//     if (!admin) {
//       return res.status(404).json({ message: "Admin not found" });
//     }

//     res.json({
//       id: admin.userId.toString(),
//       name: admin.username,
//     });
//   } catch (err) {
//     console.error("GET ADMIN ERROR:", err);
//     res.status(500).json({ message: "Error fetching admin" });
//   }
// };

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const admin = await User.findOne({
      where: { roleId: 1 }, // 👈 use correct admin roleId
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      id: admin.userId.toString(),
      name: admin.username,
    });
  } catch (err) {
    console.error("GET ADMIN ERROR:", err);
    res.status(500).json({ message: "Error fetching admin" });
  }
};

export const fetchMessagesBetweenUsers = async (req: Request, res: Response) => {
  try {
    const user1 = Number(req.params.user1);
    const user2 = Number(req.params.user2);

    if (isNaN(user1) || isNaN(user2)) {
      return res.status(400).json({ message: "Invalid user IDs" });
    }

    const messages = await sequelize.query(
      `
      SELECT * FROM "messages"
      WHERE ("senderId" = :user1 AND "receiverId" = :user2)
         OR ("senderId" = :user2 AND "receiverId" = :user1)
      ORDER BY "createdAt" ASC
      `,
      {
        replacements: { user1, user2 },
        type: QueryTypes.SELECT,
      }
    );

    res.json(messages);
  } catch (error) {
    console.error("Fetch messages between users error:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};
