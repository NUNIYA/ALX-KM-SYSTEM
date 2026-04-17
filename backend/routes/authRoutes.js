const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/experts', authController.getExperts);
router.get('/me', authMiddleware, authController.getMe);
router.patch('/me', authMiddleware, authController.updateMe);
router.get('/activity', authMiddleware, authController.getActivity);
router.get('/stats', authMiddleware, authController.getStats);

// Admin User Management
router.get('/users', authMiddleware, authController.getAllUsers);
router.patch('/users/:id', authMiddleware, authController.updateUser);
router.delete('/users/:id', authMiddleware, authController.deleteUser);

module.exports = router;
