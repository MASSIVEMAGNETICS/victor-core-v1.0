import { Server } from 'socket.io';
import WebSocket from 'ws';

const VICTOR_CORE_WS_URL = process.env.VICTOR_CORE_WS_URL || 'ws://localhost:8000/ws';

export const setupSocket = (io: Server) => {
  const victorSocket = new WebSocket(VICTOR_CORE_WS_URL);

  victorSocket.on('open', () => {
    console.log('Connected to Victor Core WebSocket');
  });

  victorSocket.on('message', (data) => {
    // Forward message from Victor Core to all clients
    io.emit('message', {
      text: data.toString(),
      senderId: 'victor-core',
      timestamp: new Date().toISOString(),
    });
  });

  victorSocket.on('close', () => {
    console.log('Disconnected from Victor Core WebSocket');
  });

  victorSocket.on('error', (error) => {
    console.error('Victor Core WebSocket error:', error);
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle messages from clients and forward to Victor Core
    socket.on('message', (msg: { text: string; senderId: string }) => {
      if (victorSocket.readyState === WebSocket.OPEN) {
        victorSocket.send(msg.text);
      } else {
        socket.emit('message', {
          text: 'Error: Not connected to Victor Core',
          senderId: 'system',
          timestamp: new Date().toISOString(),
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome! Connected to Victor Core proxy.',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });
};