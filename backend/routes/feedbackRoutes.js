const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, feedbackController.getFeedback);
router.post('/', authMiddleware, feedbackController.createFeedback);

module.exports = router;
