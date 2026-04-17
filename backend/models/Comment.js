const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, default: 'student' },
  targetType: { type: String, enum: ['resource', 'post', 'lesson', 'idea'], required: true },
  targetId: { type: mongoose.Schema.Types.ObjectId, required: true },
  parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  upvotes: { type: [String], default: [] },
  isBestAnswer: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
