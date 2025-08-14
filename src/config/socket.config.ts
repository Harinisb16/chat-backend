// socket.config.ts
import { Server } from 'socket.io';
let io: Server;

export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  // Default namespace
  io.on('connection', (socket) => {
    console.log(`User connected to default namespace: ${socket.id}`);
  });

  // Custom namespace /ws
  const wsNamespace = io.of('/ws');
  wsNamespace.on('connection', (socket) => {
    console.log(`User connected to /ws namespace: ${socket.id}`);
  });
};

export const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
};
