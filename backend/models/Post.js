const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  postType: { 
    type: String, 
    enum: ['Question', 'Knowledge Share', 'Announcement'], 
    default: 'Knowledge Share' 
  },
  category: { 
    type: String, 
    required: true, 
    enum: ['Software Engineering', 'Data Analytics', 'AI', 'Career Development', 'Soft Skills'] 
  },
  tags: { type: [String], default: [] },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorRole: { type: String, default: 'student' },
  upvotes: { type: [String], default: [] }, // Array of user IDs
  bestAnswerCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  isPinned: { type: Boolean, default: false },
  viewCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
