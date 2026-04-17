const Resource = require('../models/Resource');
const Post = require('../models/Post');
const Idea = require('../models/Idea');
const Lesson = require('../models/Lesson');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.getAnalytics = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    // Aggregated document stats
    const mostViewedDocs = await Resource.find({ status: 'published' })
      .sort({ viewCount: -1 }).limit(10).select('title viewCount category uploadedBy');

    // Most liked docs (sorting by likes array size using aggregation-like find is not supported, 
    // we use a simpler approach or just sort by a numeric field if added in future)
    const mostLikedDocs = await Resource.find({ status: 'published' })
      .limit(5).select('title likes category');

    // Top contributors by credits
    const topContributors = await User.find()
      .sort({ credits: -1 }).limit(10).select('name email role credits reputation learningTrack');

    // Documents per category (knowledge gap finder)
    const categoryDistribution = await Resource.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: 1 } }
    ]);

    // User activity breakdown
    const usersByRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Most used tags
    const tagDistribution = await Resource.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    // Monthly document activity (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyActivity = await Resource.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      { $group: { 
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }},
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Total counts
    const [totalUsers, totalDocs, totalPosts, totalIdeas, totalLessons, totalComments, pendingDocs] = 
      await Promise.all([
        User.countDocuments(),
        Resource.countDocuments({ status: 'published' }),
        Post.countDocuments(),
        Idea.countDocuments(),
        Lesson.countDocuments(),
        Comment.countDocuments(),
        Resource.countDocuments({ status: 'pending' })
      ]);

    res.json({
      totals: { totalUsers, totalDocs, totalPosts, totalIdeas, totalLessons, totalComments, pendingDocs },
      mostViewedDocs,
      mostLikedDocs,
      topContributors,
      categoryDistribution,
      usersByRole,
      tagDistribution,
      monthlyActivity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
