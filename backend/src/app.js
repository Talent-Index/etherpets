const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const config = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const SecurityUtils = require('./utils/security');
const CronJobs = require('./utils/cronJobs');
const logger = require('./utils/logger');

// Import all routes
const petRoutes = require('./routes/petRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const questRoutes = require('./routes/questRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const exportRoutes = require('./routes/exportRoutes');
const adminRoutes = require('./routes/adminRoutes');
const healthRoutes = require('./routes/healthRoutes');
const seasonRoutes = require('./routes/seasonRoutes');
const eventRoutes = require('./routes/eventRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const shopRoutes = require('./routes/shopRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const rewardRoutes = require('./routes/rewardRoutes');

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Apply security headers
app.use(SecurityUtils.securityHeaders);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', { stream: logger.stream }));
}

// CORS configuration
app.use(cors(SecurityUtils.getCorsOptions()));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(SecurityUtils.requestLogger);

// Health check route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'EtherPets API is running',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: '1.0.0',
  });
});

// API routes - Complete set
app.use('/api/pets', petRoutes);
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/leaderboards', leaderboardRoutes);
app.use('/api/quests', questRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/export', exportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/seasons', seasonRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/currency', currencyRoutes);
app.use('/api/rewards', rewardRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Error handling middleware (should be last)
app.use(errorHandler);

// Initialize cron jobs
if (config.nodeEnv !== 'test') {
  CronJobs.init();
}

module.exports = app;