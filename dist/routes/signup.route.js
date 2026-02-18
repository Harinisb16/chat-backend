"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// signup.routes.ts
const express_1 = require("express");
const signupcontroller_1 = require("../controllers/signupcontroller");
const upload_1 = require("../middleware/upload");
const router = (0, express_1.Router)();
const signupController = new signupcontroller_1.SignupController();
// router.post("/", signupController.create.bind(signupController));
router.post("/signup", upload_1.upload.single("photo"), (req, res) => signupController.create(req, res));
router.get("/", signupController.findAll.bind(signupController));
router.get("/:id", signupController.findOne.bind(signupController));
router.put("/:id", signupController.update.bind(signupController));
router.delete("/:id", signupController.delete.bind(signupController));
exports.default = router;
