// chat.routes.ts
import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { getAdmin } from "../controllers/chat.controller";


const router = Router();

/* ================= CHAT ROUTES ================= */

// Fetch chats for the logged-in user (admin sees all users, normal user sees admin)
router.get("/", chatController.fetchChatsForUser);

// Fetch all users (for admin sidebar)
// router.get("/users", chatController.fetchUsers);
router.get("/admin", getAdmin);

// Get messages between admin and a user
router.get("/messages/:userId/:adminId", chatController.fetchMessages);

// Get messages between any two users
router.get("/:user1/:user2", chatController.fetchMessagesBetweenUsers); // optional

export default router;
