const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');

const authMiddleware = require('../middleware/authMiddleware');

router.get('/', lessonController.getLessons);
router.post('/', authMiddleware, lessonController.createLesson);
router.patch('/:id/upvote', lessonController.upvoteLesson);

module.exports = router;
