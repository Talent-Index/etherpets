const express = require('express');
const AdminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Admin routes
router.get('/stats', AdminController.getSystemStats);
router.get('/users', AdminController.getUserManagement);
router.get('/pets', AdminController.getPetManagement);
router.get('/logs', AdminController.getSystemLogs);
router.put('/users/:walletAddress', AdminController.updateUser);
router.put('/pets/:petId', AdminController.updatePet);
router.post('/maintenance', AdminController.runMaintenance);

module.exports = router;