const HealthCheckService = require('../services/healthCheckService');

class HealthController {
  // Basic health check
  static async healthCheck(req, res) {
    try {
      const health = await HealthCheckService.performHealthCheck();

      const statusCode = health.healthy ? 200 : 503;

      res.status(statusCode).json({
        success: health.healthy,
        data: health,
      });
    } catch (error) {
      res.status(503).json({
        success: false,
        message: 'Health check failed',
        error: error.message,
      });
    }
  }

  // Detailed metrics
  static async getMetrics(req, res) {
    try {
      const metrics = await HealthCheckService.getDetailedMetrics();

      res.json({
        success: true,
        data: metrics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching metrics',
        error: error.message,
      });
    }
  }

  // Readiness check (for Kubernetes/load balancers)
  static async readinessCheck(req, res) {
    try {
      const health = await HealthCheckService.performHealthCheck();

      if (health.healthy) {
        res.json({
          status: 'ready',
          timestamp: new Date(),
        });
      } else {
        res.status(503).json({
          status: 'not ready',
          checks: health.checks,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      res.status(503).json({
        status: 'error',
        error: error.message,
        timestamp: new Date(),
      });
    }
  }

  // Liveness check (for Kubernetes)
  static async livenessCheck(req, res) {
    // Simple check - if the server responds, it's alive
    res.json({
      status: 'alive',
      timestamp: new Date(),
      uptime: process.uptime(),
    });
  }
}

module.exports = HealthController;