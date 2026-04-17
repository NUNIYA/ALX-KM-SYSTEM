const Comment = require('../models/Comment');
const User = require('../models/User');

// Get comments for a target (with threading)
exports.getComments = async (req, res) => {
  try {
    const { targetType, targetId } = req.query;
    const comments = await Comment.find({ targetType, targetId, parentCommentId: null })
      .sort({ createdAt: -1 });
    
    // Attach nested replies for each top-level comment
    const withReplies = await Promise.all(comments.map(async (comment) => {
      const replies = await Comment.find({ parentCommentId: comment._id }).sort({ createdAt: 1 });
      return { ...comment.toObject(), replies };
    }));

    res.json(withReplies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a comment or reply
exports.createComment = async (req, res) => {
  try {
    const { body, targetType, targetId, parentCommentId } = req.body;
    
    const comment = new Comment({
      body,
      targetType,
      targetId,
      parentCommentId: parentCommentId || null,
      authorId: req.user._id,
      authorName: req.user.name,
      authorRole: req.user.role
    });

    const saved = await comment.save();
    
    // Reputation boost for commenter
    await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: 5, credits: 5 } });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Upvote a comment
exports.upvoteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    const userId = req.user._id.toString();
    const idx = comment.upvotes.indexOf(userId);
    if (idx > -1) comment.upvotes.splice(idx, 1);
    else comment.upvotes.push(userId);
    
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Mark as Best Answer (Mentor or Admin only)
exports.markBestAnswer = async (req, res) => {
  try {
    if (!['facilitator', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    // Unmark previous best answer for this target
    await Comment.updateMany(
      { targetType: req.body.targetType, targetId: req.body.targetId },
      { isBestAnswer: false }
    );
    const comment = await Comment.findByIdAndUpdate(req.params.id, { isBestAnswer: true }, { new: true });
    
    // Give reputation boost to best answer author
    await User.findByIdAndUpdate(comment.authorId, { $inc: { reputation: 20, credits: 20 } });

    res.json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete comment (admin or own comment)
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Not found' });
    
    if (req.user.role !== 'admin' && comment.authorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
