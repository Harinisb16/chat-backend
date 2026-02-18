"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_middleware_1 = require("../middleware/admin.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const router = (0, express_1.Router)();
router.get("/admin/users", auth_middleware_1.authenticate, //  authMiddleware
admin_middleware_1.adminOnly, //  adminOnly
auth_controller_1.getAll //  controller
);
exports.default = router;
