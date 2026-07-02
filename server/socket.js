const { Server } = require('socket.io');
const ChatMessage = require('./models/ChatMessage');
const InterestRequest = require('./models/InterestRequest');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
    }
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_chat', (interestId) => {
      socket.join(interestId);
      console.log(`Socket ${socket.id} joined chat ${interestId}`);
    });

    socket.on('send_message', async (data) => {
      try {
        const { interestId, senderId, content } = data;
        
        const interest = await InterestRequest.findById(interestId);
        if (!interest || interest.status !== 'accepted') {
          return socket.emit('error', 'Cannot send message to this chat');
        }

        const msg = await ChatMessage.create({
          interestRequest: interestId,
          sender: senderId,
          content
        });

        const populatedMsg = await msg.populate('sender', 'name role');

        io.to(interestId).emit('receive_message', populatedMsg);
      } catch (err) {
        console.error('Socket send_message error:', err);
        socket.emit('error', 'Failed to send message');
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

module.exports = { initSocket, getIo };
