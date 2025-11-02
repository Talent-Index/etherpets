const AdminService = require('../services/adminService');

class AdminController {
  // Get system statistics
  static async getSystemStats(req, res) {
    try {
      const stats = await AdminService.getSystemStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching system stats',
        error: error.message,
      });
    }
  }

  // Get user management data
  static async getUserManagement(req, res) {
    try {
      const { page = 1, limit = 20, search = '' } = req.query;

      const data = await AdminService.getUserManagementData(
        parseInt(page),
        parseInt(limit),
        search
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user management data',
        error: error.message,
      });
    }
  }

  // Get pet management data
  static async getPetManagement(req, res) {
    try {
      const { page = 1, limit = 20, ...filters } = req.query;

      const data = await AdminService.getPetManagementData(
        parseInt(page),
        parseInt(limit),
        filters
      );

      res.json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching pet management data',
        error: error.message,
      });
    }
  }

  // Update user data
  static async updateUser(req, res) {
    try {
      const { walletAddress } = req.params;
      const updates = req.body;

      const result = await AdminService.updateUserData(walletAddress, updates);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating user data',
        error: error.message,
      });
    }
  }

  // Update pet data
  static async updatePet(req, res) {
    try {
      const { petId } = req.params;
      const updates = req.body;

      const result = await AdminService.updatePetData(petId, updates);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error updating pet data',
        error: error.message,
      });
    }
  }

  // Run system maintenance
  static async runMaintenance(req, res) {
    try {
      const result = await AdminService.runSystemMaintenance();

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error running system maintenance',
        error: error.message,
      });
    }
  }

  // Get system logs
  static async getSystemLogs(req, res) {
    try {
      const { limit = 100 } = req.query;

      const logs = await AdminService.getSystemLogs(parseInt(limit));

      res.json({
        success: true,
        data: logs,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching system logs',
        error: error.message,
      });
    }
  }
}

module.exports = AdminController;