const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', commentController.getComments);
router.post('/', authMiddleware, commentController.createComment);
router.patch('/:id/upvote', authMiddleware, commentController.upvoteComment);
router.patch('/:id/best-answer', authMiddleware, commentController.markBestAnswer);
router.delete('/:id', authMiddleware, commentController.deleteComment);

module.exports = router;
