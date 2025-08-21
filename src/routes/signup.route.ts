// signup.routes.ts
import { Router } from "express";
import { SignupController } from "../controllers/signupcontroller";
import { upload } from "../middleware/upload";


const router = Router();
const signupController = new SignupController();

// router.post("/", signupController.create.bind(signupController));

router.post("/signup", upload.single("photo"), (req, res) =>
  signupController.create(req, res)
);
router.get("/", signupController.findAll.bind(signupController));
router.get("/:id", signupController.findOne.bind(signupController));
router.put("/:id", signupController.update.bind(signupController));
router.delete("/:id", signupController.delete.bind(signupController));

export default router;
