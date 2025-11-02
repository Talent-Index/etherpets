const express = require('express');
const ExportController = require('../controllers/exportController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// Export routes
router.get('/pets/:petId/pdf', ExportController.exportPetReport);
router.get('/users/:walletAddress/json', ExportController.exportUserData);
router.get('/users/:walletAddress/csv', ExportController.exportActivityCSV);

module.exports = router;