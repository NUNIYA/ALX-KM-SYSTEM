const express = require('express');
const router = express.Router();
const ideaController = require('../controllers/ideaController');

const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', ideaController.getIdeas);
router.post('/', authMiddleware, upload.single('image'), ideaController.createIdea);
router.patch('/:id/upvote', authMiddleware, ideaController.upvoteIdea);
router.patch('/:id/status', authMiddleware, ideaController.updateStatus);

module.exports = router;
