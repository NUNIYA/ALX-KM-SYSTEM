const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

router.get('/', feedbackController.getFeedback);
router.post('/', feedbackController.createFeedback);

module.exports = router;
