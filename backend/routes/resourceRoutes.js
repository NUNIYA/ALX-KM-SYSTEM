const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', authMiddleware, resourceController.getResources);
router.get('/:id', authMiddleware, resourceController.getResourceById);
router.post('/', authMiddleware, upload.single('file'), resourceController.createResource);
router.patch('/:id', authMiddleware, resourceController.updateResource);
router.patch('/:id/like', authMiddleware, resourceController.toggleLike);
router.patch('/:id/view', authMiddleware, resourceController.incrementView);
router.patch('/:id/bookmark', authMiddleware, resourceController.toggleBookmark);
router.patch('/:id/upvote', authMiddleware, resourceController.upvote);
router.delete('/:id', authMiddleware, resourceController.deleteResource);

module.exports = router;
