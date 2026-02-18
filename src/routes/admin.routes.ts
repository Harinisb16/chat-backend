import { Router } from "express";
import { adminOnly } from "../middleware/admin.middleware";
import { authenticate } from "../middleware/auth.middleware";
import { getAll } from "../controllers/auth.controller";

const router = Router();

router.get(
  "/admin/users",
  authenticate, //  authMiddleware
  adminOnly,    //  adminOnly
  getAll        //  controller
);

export default router;
