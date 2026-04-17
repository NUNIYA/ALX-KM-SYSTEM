const User = require('../models/User');
const Post = require('../models/Post');
const Idea = require('../models/Idea');
const Lesson = require('../models/Lesson');
const jwt = require('jsonwebtoken');

exports.getActivity = async (req, res) => {
  try {
    const userId = req.user._id;

    const [posts, ideas, lessons] = await Promise.all([
      Post.find({ authorId: userId }).sort({ createdAt: -1 }),
      Idea.find({ authorId: userId }).sort({ createdAt: -1 }),
      Lesson.find({ authorId: userId }).sort({ createdAt: -1 })
    ]);

    // Map and flatten into a unified timeline
    const activity = [
      ...posts.map(p => ({ ...p.toObject(), type: 'post' })),
      ...ideas.map(i => ({ ...i.toObject(), type: 'idea' })),
      ...lessons.map(l => ({ ...l.toObject(), type: 'lesson' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const [posts, ideas, lessons] = await Promise.all([
      Post.countDocuments({ authorId: userId }),
      Idea.countDocuments({ authorId: userId }),
      Lesson.countDocuments({ authorId: userId })
    ]);
    res.json({ posts, ideas, lessons });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'alx_km_secret_key', {
    expiresIn: '30d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, learningTrack, skills } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Process skills: comma-separated string to array
    const skillsArray = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim()).filter(s => s !== "")
      : skills;

    const user = new User({
      name,
      email,
      password,
      role,
      learningTrack,
      skills: skillsArray
    });

    await user.save();
    
    // Return user with token
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      ...userResponse,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Return user with token
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      ...userResponse,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getExperts = async (req, res) => {
  try {
    const { skill } = req.query;
    let query = { skills: { $exists: true, $not: { $size: 0 } } };
    
    if (skill) {
      query.skills = { $regex: skill, $options: 'i' };
    }
    
    const experts = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(experts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, learningTrack, skills } = req.body;
    
    // Process skills if provided as string
    const skillsArray = typeof skills === 'string' 
      ? skills.split(',').map(s => s.trim()).filter(s => s !== "")
      : skills;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { 
        ...(name && { name }), 
        ...(learningTrack && { learningTrack }), 
        ...(skillsArray && { skills: skillsArray }) 
      },
      { new: true }
    ).select('-password');

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: List all users
exports.getAllUsers = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Update user (role, track, region)
exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const { role, learningTrack, region } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      { ...(role && { role }), ...(learningTrack && { learningTrack }), ...(region && { region }) },
      { new: true }
    ).select('-password');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN: Delete/suspend user
exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User suspended successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
