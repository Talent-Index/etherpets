const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user exists and is admin
    const user = await User.findById(decoded.user.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // In a real implementation, you would check user.role or user.isAdmin
    // For now, we'll use a simple environment variable check
    const adminWallets = process.env.ADMIN_WALLETS?.split(',') || [];
    
    if (!adminWallets.includes(user.walletAddress.toLowerCase())) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.',
      });
    }

    req.admin = {
      id: user._id,
      walletAddress: user.walletAddress,
      username: user.username,
    };

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid or admin access denied',
    });
  }
};

module.exports = adminMiddleware;