const EventService = require('../services/eventService');

class EventController {
  // Get event statistics
  static async getEventStats(req, res) {
    try {
      const { timeRange = '24h' } = req.query;

      const stats = await EventService.getEventStats(timeRange);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching event statistics',
        error: error.message,
      });
    }
  }

  // Get user event history
  static async getUserEventHistory(req, res) {
    try {
      const walletAddress = req.user.walletAddress;
      const filters = req.query;

      const history = await EventService.getUserEventHistory(walletAddress, filters);

      res.json({
        success: true,
        data: history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching user event history',
        error: error.message,
      });
    }
  }

  // Log custom event (for extended gameplay)
  static async logCustomEvent(req, res) {
    try {
      const eventData = {
        ...req.body,
        petId: req.body.petId,
        type: req.body.type || 'custom',
      };

      const event = await EventService.logEvent(eventData);

      res.json({
        success: true,
        data: event,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error logging custom event',
        error: error.message,
      });
    }
  }

  // Clean up old events (admin only)
  static async cleanupEvents(req, res) {
    try {
      const { retentionDays = 90 } = req.body;

      const result = await EventService.cleanupOldEvents(retentionDays);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error cleaning up events',
        error: error.message,
      });
    }
  }
}

module.exports = EventController;