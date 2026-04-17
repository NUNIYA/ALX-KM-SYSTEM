const Resource = require('../models/Resource');
const User = require('../models/User');

exports.getResources = async (req, res) => {
  try {
    const { category, search, filter } = req.query;
    let query = {};
    const userRole = req.user.role;

    // Role-based restrictions
    if (userRole === 'student') {
      query.visibility = { $in: ['public', 'student-only'] };
      query.status = 'published';
    } else if (userRole === 'facilitator') {
      query.visibility = { $ne: 'admin-only' };
      query.$or = [
        { status: 'published' },
        { uploadedBy: req.user.name }
      ];
    } else if (userRole === 'admin') {
      // Admins see everything
    }

    // Apply standard filters
    if (category) query.category = category;
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      if (query.$or) {
        query.$and = [
          { $or: query.$or },
          { $or: [{ title: searchRegex }, { description: searchRegex }] }
        ];
        delete query.$or;
      } else {
        query.$or = [{ title: searchRegex }, { description: searchRegex }];
      }
    }

    // Custom Filters from UI
    if (filter === 'my-docs' && userRole !== 'student') {
       query.uploadedBy = req.user.name;
    }
    if (filter === 'drafts' && userRole !== 'student') {
       query.status = { $in: ['draft', 'pending'] };
       query.uploadedBy = req.user.name;
    }
    if (filter === 'pending' && userRole === 'admin') {
       query.status = 'pending';
    }
    if (filter === 'bookmarked') {
       query.bookmarks = req.user._id;
    }
    // More filters can be added here easily

    const resources = await Resource.find(query).sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single document by ID and increment view count
exports.getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Document not found' });

    // Visibility check
    const role = req.user.role;
    if (resource.visibility === 'admin-only' && role !== 'admin') {
      return res.status(403).json({ message: 'Restricted document' });
    }
    if (resource.visibility === 'mentor-only' && role === 'student') {
      return res.status(403).json({ message: 'Mentor-only document' });
    }

    // Increment view silently
    await Resource.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Toggle like on a document
exports.toggleLike = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const userId = req.user._id.toString();
    const idx = resource.likes.indexOf(userId);
    if (idx > -1) resource.likes.splice(idx, 1);
    else resource.likes.push(userId);
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Manual view increment (for tracking from client explicitly)
exports.incrementView = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      { $inc: { viewCount: 1 } },
      { new: true }
    );
    res.json({ viewCount: resource.viewCount });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.createResource = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const resourceData = {
      title,
      description,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      uploadedBy: req.user.name,
      authorRole: req.user.role,
      // Mentors/Facilitators go to draft; Admins publish directly
      status: req.user.role === 'admin' ? 'published' : 'draft',
      // Save the relative path to the uploaded file
      fileUrl: req.file ? `uploads/${req.file.filename}` : ''
    };

    const resource = new Resource(resourceData);
    const newResource = await resource.save();

    // Award Credits for uploading
    await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 10 } });

    res.status(201).json(newResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    
    // Check permissions
    if (req.user.role === 'student') return res.status(403).json({ message: 'Forbidden' });
    if (req.user.role === 'facilitator' && resource.uploadedBy !== req.user.name) {
       return res.status(403).json({ message: 'Forbidden: Can only edit your own docs' });
    }

    Object.assign(resource, req.body);
    const updatedResource = await resource.save();
    res.json(updatedResource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Toggle Bookmark
exports.toggleBookmark = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    const userId = req.user._id.toString();
    const index = resource.bookmarks.indexOf(userId);
    if (index > -1) {
      resource.bookmarks.splice(index, 1);
    } else {
      resource.bookmarks.push(userId);
    }
    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helpful Upvote (Student)
exports.upvote = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(
      req.params.id, 
      { $inc: { helpfulVotes: 1 } }, 
      { new: true }
    );
    res.json(resource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: 'Not found' });
    
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Only admins can delete directly' });

    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted Successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
