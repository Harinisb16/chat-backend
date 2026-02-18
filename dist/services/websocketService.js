"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const ws_1 = __importStar(require("ws"));
class WebSocketService {
    constructor(server) {
        this.wss = new ws_1.Server({ server });
        this.wss.on('connection', (ws) => {
            console.log('New client connected');
            ws.on('message', (message) => {
                console.log('received:', message);
                // Broadcast message to all connected clients
                this.wss.clients.forEach((client) => {
                    if (client.readyState === ws_1.default.OPEN) {
                        client.send(message);
                    }
                });
            });
            ws.on('close', () => {
                console.log('Client disconnected');
            });
        });
    }
    broadcast(data) {
        const message = JSON.stringify(data);
        this.wss.clients.forEach(client => {
            if (client.readyState === ws_1.default.OPEN) {
                client.send(message);
            }
        });
    }
}
exports.WebSocketService = WebSocketService;
