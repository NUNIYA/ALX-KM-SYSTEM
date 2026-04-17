const mongoose = require('mongoose');

const ideaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Software Engineering', 'Data Analytics', 'AI', 'Career Development', 'Soft Skills'] 
  },
  tags: { type: [String], default: [] },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorRole: { type: String, default: 'student' },
  imageUrl: { type: String, default: null },
  upvotes: { type: [String], default: [] }, // Array of user IDs
  likes: { type: Number, default: 0 }, // Keep for legacy
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'implemented', 'rejected'], 
    default: 'pending' 
  },
  adminNote: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Idea', ideaSchema);
