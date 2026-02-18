"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitEvent = void 0;
const socket_config_1 = require("../config/socket.config");
const onlineUsers = new Map();
// userId -> socketId
const emitEvent = (eventName, payload) => {
    (0, socket_config_1.getIO)().emit(eventName, payload);
};
exports.emitEvent = emitEvent;
