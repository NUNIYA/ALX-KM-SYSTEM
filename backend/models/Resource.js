const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, default: '' }, // Rich HTML text body
  category: { 
    type: String, 
    required: true, 
    enum: ['SOP', 'Curriculum', 'Coaching Guide', 'Partnerships', 'Software Engineering', 'Data Analytics', 'AI'] 
  },
  track: { type: String, enum: ['Software Engineering', 'Data Science', 'Cloud', 'All'], default: 'All' },
  region: { type: String, enum: ['Addis Ababa', 'Oromia', 'Amhara', 'All'], default: 'All' },
  language: { type: String, enum: ['English', 'Amharic'], default: 'English' },
  tags: { type: [String], default: [] },
  uploadedBy: { type: String, required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorRole: { type: String, default: 'student' },
  status: { type: String, enum: ['draft', 'pending', 'published'], default: 'published' },
  visibility: { type: String, enum: ['public', 'student-only', 'mentor-only', 'admin-only'], default: 'public' },
  cohort: { type: String, default: 'All' },
  bookmarks: { type: [String], default: [] },
  likes: { type: [String], default: [] }, // Array of user IDs
  helpfulVotes: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
  fileUrl: { type: String, default: '' },
  externalLink: { type: String, default: '' },
  version: { type: Number, default: 1 },
  versionHistory: [{
    version: Number,
    title: String,
    description: String,
    content: String,
    editedBy: String,
    editedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resource', resourceSchema);
