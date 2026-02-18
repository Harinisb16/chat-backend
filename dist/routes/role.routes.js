"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const role_controller_1 = __importDefault(require("../controllers/role.controller"));
const router = (0, express_1.Router)();
router.post('/', role_controller_1.default.create);
router.get('/', role_controller_1.default.getAll);
router.get('/:id', role_controller_1.default.getById);
router.put('/:id', role_controller_1.default.update);
router.delete('/:id', role_controller_1.default.delete);
exports.default = router;
