const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  challenge: { type: String, default: "" },
  description: { type: String, required: true }, // Used for observation
  recommendation: { type: String, default: "" },
  category: { 
    type: String, 
    required: true, 
    enum: ['Software Engineering', 'Data Analytics', 'AI', 'Career Development', 'Soft Skills'] 
  },
  tags: { type: [String], default: [] },
  author: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  upvotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Lesson', lessonSchema);
