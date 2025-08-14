import { getIO } from "../config/socket.config";

export const emitEvent = (eventName: string, payload: any) => {
  getIO().emit(eventName, payload);
};
