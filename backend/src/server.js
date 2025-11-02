const http = require('http');
const app = require('./app');
const SocketService = require('./services/socketService');
const config = require('./config/env');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const socketService = new SocketService(server);

// Make socket service available to routes if needed
app.set('socketService', socketService);

const PORT = config.port;

server.listen(PORT, () => {
  console.log(`
🚀 EtherPets Backend Server Started!
    
📍 Environment: ${config.nodeEnv}
📍 Port: ${PORT}
📍 Database: ${config.database.uri}
📍 Blockchain: ${config.blockchain.avalancheRpc}
    
📊 Endpoints:
   • Health: http://localhost:${PORT}/health
   • API: http://localhost:${PORT}/api
   • Websocket: ws://localhost:${PORT}
    
🔧 Features:
   • Pet Management ✅
   • Real-time Updates ✅
   • AI Mood Analysis ✅
   • Achievement System ✅
   • Data Export ✅
   • Analytics ✅
   • Backup System ✅
    
✨ Server is ready to receive requests!
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = server;