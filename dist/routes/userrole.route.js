"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userrole_controller_1 = __importDefault(require("../controllers/userrole.controller"));
const router = (0, express_1.Router)();
router.post('/', userrole_controller_1.default.create);
router.get('/', userrole_controller_1.default.getAll);
router.get('/:id', userrole_controller_1.default.getById);
router.put('/:id', userrole_controller_1.default.update);
router.delete('/:id', userrole_controller_1.default.delete);
exports.default = router;
