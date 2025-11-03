// Main server entry point
// This file bootstraps the complete application from the src directory

require('dotenv').config();
const server = require('./src/server');

// Export for testing purposes
module.exports = server;