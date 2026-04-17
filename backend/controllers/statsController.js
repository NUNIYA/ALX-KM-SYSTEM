const Resource = require('../models/Resource');
const Post = require('../models/Post');
const Idea = require('../models/Idea');
const Feedback = require('../models/Feedback');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

exports.getStats = async (req, res) => {
  try {
    const totalResources = await Resource.countDocuments();
    const totalPosts = await Post.countDocuments();
    const totalIdeas = await Idea.countDocuments();
    const totalFeedback = await Feedback.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalExperts = await User.countDocuments({ 'skills.0': { $exists: true } });

    res.json({
      totalResources,
      totalPosts,
      totalIdeas,
      totalFeedback,
      totalLessons,
      totalExperts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
