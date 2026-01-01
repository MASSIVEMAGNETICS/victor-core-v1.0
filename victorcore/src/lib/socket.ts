import { Server } from 'socket.io';
import { VictorCore } from '../core/VictorCore';

// Initialize Victor Core singleton
const victor = new VictorCore();

export const setupSocket = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle messages
    socket.on('message', async (msg: { text: string; senderId: string }) => {
      console.log(`[Socket] Received message from ${msg.senderId}: ${msg.text}`);

      try {
        const response = await victor.receiveMessage(msg.text, msg.senderId);

        socket.emit('message', {
          text: response,
          senderId: 'Victor',
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error processing message:", error);
        socket.emit('message', {
          text: "Victor: [Internal Error] " + error,
          senderId: 'Victor',
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
      text: 'Victor Core v1.0 is online. State your intent.',
      senderId: 'Victor',
      timestamp: new Date().toISOString(),
    });
  });
};