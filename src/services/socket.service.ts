import { getIO } from "../config/socket.config";


const onlineUsers = new Map<string, string>(); 
// userId -> socketId

export const emitEvent = (eventName: string, payload: any) => {
  getIO().emit(eventName, payload);
};

