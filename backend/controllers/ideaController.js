const Idea = require('../models/Idea');
const User = require('../models/User');

exports.getIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find().sort({ createdAt: -1 });
    res.json(ideas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createIdea = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;
    
    const ideaData = { 
      title, 
      description, 
      category, 
      tags: typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : tags,
      author: req.user?.name || 'Anonymous',
      authorId: req.user?._id
    };

    if (req.file) {
      ideaData.imageUrl = `uploads/${req.file.filename}`;
    }
    
    const idea = new Idea(ideaData);
    const newIdea = await idea.save();
    
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 15 } });
    }

    res.status(201).json(newIdea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.upvoteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });
    
    const userId = req.user._id.toString();
    const idx = idea.upvotes.indexOf(userId);
    if (idx > -1) {
      idea.upvotes.splice(idx, 1);
      idea.likes = Math.max(0, idea.likes - 1);
    } else {
      idea.upvotes.push(userId);
      idea.likes += 1;
    }
    
    await idea.save();
    res.json(idea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: 'Idea not found' });

    let friendlyPrefix = "";
    if (status === 'approved') {
      friendlyPrefix = "Excellent thinking! We are officially proceeding with your vision. ";
    } else if (status === 'rejected') {
      friendlyPrefix = "We value this contribution, but we are currently prioritizing and indexing other institutional nodes. Please iterate and transmit again soon. ";
    } else if (status === 'implemented') {
      friendlyPrefix = "Mission Accomplished: Your vision is now part of the ALX Ethiopia Mainframe. ";
    }

    idea.status = status;
    idea.adminNote = friendlyPrefix + (adminNote || "");
    
    await idea.save();
    res.json(idea);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
