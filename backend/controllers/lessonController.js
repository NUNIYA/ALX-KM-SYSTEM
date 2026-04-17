const Lesson = require('../models/Lesson');
const User = require('../models/User');

exports.getLessons = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort by upvotes first, then date
    const lessons = await Lesson.find(query).sort({ upvotes: -1, createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLesson = async (req, res) => {
  try {
    const { title, challenge, description, recommendation, category, tags, author } = req.body;
    
    const tagsArray = typeof tags === 'string' 
      ? tags.split(',').map(t => t.trim()).filter(t => t !== "")
      : tags;

    const lesson = new Lesson({
      title,
      challenge,
      description,
      recommendation,
      category,
      tags: tagsArray,
      author: req.user?.name || author || 'Anonymous',
      authorId: req.user?._id
    });

    const savedLesson = await lesson.save();
    
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 20 } });
    }
    
    res.status(201).json(savedLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.upvoteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    
    lesson.upvotes += 1;
    await lesson.save();
    res.json(lesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
