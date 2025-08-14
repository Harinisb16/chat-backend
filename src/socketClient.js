// socketClient.js
const { io } = require('socket.io-client');

const socket = io('http://localhost:5000/ws'); // must match your namespace

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

socket.on('user:created', (data) => {
  console.log('Received user:created event:', data);
});
