const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Pet = require('../models/Pet');
const NotificationService = require('./notificationService');

class SocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });
    
    this.connectedUsers = new Map();
    this.setupMiddleware();
    this.setupEventHandlers();
  }

  setupMiddleware() {
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.user.id);
        
        if (!user) {
          return next(new Error('User not found'));
        }

        socket.userId = user._id;
        socket.walletAddress = user.walletAddress;
        next();
      } catch (error) {
        next(new Error('Authentication failed'));
      }
    });
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`User ${socket.walletAddress} connected`);
      
      // Store user connection
      this.connectedUsers.set(socket.walletAddress, socket.id);

      // Join user to their personal room
      socket.join(`user:${socket.walletAddress}`);

      // Pet-related events
      socket.on('pet:subscribe', (petId) => {
        socket.join(`pet:${petId}`);
        console.log(`User ${socket.walletAddress} subscribed to pet ${petId}`);
      });

      socket.on('pet:unsubscribe', (petId) => {
        socket.leave(`pet:${petId}`);
      });

      socket.on('pet:action', async (data) => {
        try {
          const { petId, action, payload } = data;
          
          // Broadcast action to all users subscribed to this pet
          socket.to(`pet:${petId}`).emit('pet:action', {
            action,
            payload,
            timestamp: new Date(),
            initiatedBy: socket.walletAddress,
          });
        } catch (error) {
          socket.emit('error', { message: 'Failed to process pet action' });
        }
      });

      // Real-time notifications
      socket.on('notifications:subscribe', () => {
        socket.join(`notifications:${socket.walletAddress}`);
      });

      // Chat/messaging
      socket.on('message:send', (data) => {
        const { to, message } = data;
        
        // Send private message to specific user
        socket.to(`user:${to}`).emit('message:receive', {
          from: socket.walletAddress,
          message,
          timestamp: new Date(),
        });
      });

      // Game events
      socket.on('game:join', (roomId) => {
        socket.join(`game:${roomId}`);
        socket.to(`game:${roomId}`).emit('player:joined', {
          player: socket.walletAddress,
          timestamp: new Date(),
        });
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        this.connectedUsers.delete(socket.walletAddress);
        console.log(`User ${socket.walletAddress} disconnected`);
      });
    });
  }

  // Send notification to specific user
  async sendNotification(walletAddress, notification) {
    const socketId = this.connectedUsers.get(walletAddress);
    if (socketId) {
      this.io.to(socketId).emit('notification', notification);
      return true;
    }
    return false;
  }

  // Broadcast to all users in a room
  broadcastToRoom(room, event, data) {
    this.io.to(room).emit(event, data);
  }

  // Send to specific user
  sendToUser(walletAddress, event, data) {
    const socketId = this.connectedUsers.get(walletAddress);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Pet state update broadcast
  async broadcastPetUpdate(petId, update) {
    this.broadcastToRoom(`pet:${petId}`, 'pet:update', {
      petId,
      update,
      timestamp: new Date(),
    });
  }

  // Game event broadcast
  broadcastGameEvent(gameId, event) {
    this.broadcastToRoom(`game:${gameId}`, 'game:event', event);
  }
}

module.exports = SocketService;