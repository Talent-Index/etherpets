const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { ethers } = require('ethers');

class UserController {
  // Login or create user with wallet
  static async loginOrCreateUser(req, res) {
    try {
      const { walletAddress, signature, message } = req.body;

      if (!walletAddress) {
        return res.status(400).json({
          success: false,
          message: 'Wallet address is required',
        });
      }

      // Verify signature (simplified for demo)
      // In production, implement proper signature verification
      let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

      if (!user) {
        // Create new user
        user = new User({
          walletAddress: walletAddress.toLowerCase(),
          username: `Guardian${Date.now().toString().slice(-4)}`,
        });
        await user.save();
      }

      // Update last login
      user.lastLogin = new Date();
      user.streak = await this.calculateStreak(user);
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { 
          user: { 
            id: user._id, 
            walletAddress: user.walletAddress 
          } 
        },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '7d' }
      );

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            walletAddress: user.walletAddress,
            username: user.username,
            streak: user.streak,
            createdAt: user.createdAt,
          },
          token,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error during login',
        error: error.message,
      });
    }
  }

  // Get user profile
  static async getUserProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      res.json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user profile',
        error: error.message,
      });
    }
  }

  // Update user profile
  static async updateUserProfile(req, res) {
    try {
      const { username, preferences } = req.body;
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      if (username) user.username = username;
      if (preferences) user.preferences = { ...user.preferences, ...preferences };

      await user.save();

      res.json({
        success: true,
        data: user,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating profile',
        error: error.message,
      });
    }
  }

  // Get user statistics
  static async getUserStats(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      // Calculate additional stats
      const stats = {
        totalPlayTime: user.totalPlayTime,
        streak: user.streak,
        accountAge: Math.floor((new Date() - user.createdAt) / (1000 * 60 * 60 * 24)),
        lastLogin: user.lastLogin,
      };

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user stats',
        error: error.message,
      });
    }
  }

  // Helper method to calculate login streak
  static async calculateStreak(user) {
    const now = new Date();
    const lastLogin = new Date(user.lastLogin);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    // If last login was yesterday or today, continue streak
    if (lastLogin.toDateString() === yesterday.toDateString() || 
        lastLogin.toDateString() === now.toDateString()) {
      return user.streak + 1;
    }
    
    // If last login was today, maintain streak
    if (lastLogin.toDateString() === now.toDateString()) {
      return user.streak;
    }
    
    // Otherwise reset streak
    return 1;
  }
}

module.exports = UserController;