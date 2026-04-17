const Post = require('../models/Post');
const User = require('../models/User');
const Comment = require('../models/Comment');

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    
    // Attach comment counts to each post
    const postsWithCounts = await Promise.all(posts.map(async (post) => {
      const count = await Comment.countDocuments({ 
        targetType: 'post', 
        targetId: post._id 
      });
      return { ...post.toObject(), commentCount: count };
    }));

    res.json(postsWithCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  const post = new Post(req.body);
  try {
    const newPost = await post.save();
    
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 5 } });
    }

    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
