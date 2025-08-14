import WebSocket, { Server as WebSocketServer } from 'ws';
import http from 'http';

export class WebSocketService {
  private wss: WebSocketServer;

  constructor(server: http.Server) {
    this.wss = new WebSocketServer({ server });

    this.wss.on('connection', (ws: WebSocket) => {
      console.log('New client connected');

      ws.on('message', (message: string) => {
        console.log('received:', message);
        // Broadcast message to all connected clients
        this.wss.clients.forEach((client: { readyState: any; send: (arg0: string) => void; }) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });

      ws.on('close', () => {
        console.log('Client disconnected');
      });
    });
  }

    broadcast(data: any) {
    const message = JSON.stringify(data);
    this.wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
