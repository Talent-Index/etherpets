const express = require('express');
const HealthController = require('../controllers/healthController');

const router = express.Router();

// Health check routes (public)
router.get('/', HealthController.healthCheck);
router.get('/metrics', HealthController.getMetrics);
router.get('/ready', HealthController.readinessCheck);
router.get('/live', HealthController.livenessCheck);

module.exports = router;