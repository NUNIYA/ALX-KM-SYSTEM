const Resource = require('../models/Resource');
const User = require('../models/User');
const Lesson = require('../models/Lesson');

// AURA Intelligence Processing Engine
exports.processChat = async (req, res) => {
  try {
    const { message } = req.body;
    const query = message.toLowerCase();
    
    let response = "";
    let suggestions = [];

    // INTENT: Social / Initialization
    if (query.includes("hi") || query.includes("hello") || query.includes("hey") || query.includes("who are you") || query.includes("aura")) {
      response = "I am AURA (ALX Universal Resource Assistant). I act as the central nervous system for our Knowledge Portal. I can retrieve intelligence, map you to peer experts, or audit your professional impact. What's our objective today?";
    }
    
    // INTENT: Knowledge Extraction (Resources)
    else if (query.includes("resource") || query.includes("file") || query.includes("book") || query.includes("document") || query.includes("learn") || query.includes("study") || query.includes("engineering") || query.includes("data")) {
      const resourcesFound = await Resource.find({ 
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } }
        ]
      }).limit(4);

      if (resourcesFound.length > 0) {
        response = `My scans show ${resourcesFound.length} high-value intelligence assets matching your query. These resources are verified for the ALX Ethiopia network:`;
        suggestions = resourcesFound.map(r => ({ title: r.title, type: 'resource', url: r.fileUrl }));
      } else {
        response = "I couldn't find specific files in my current index. However, I recommend checking the Main Repository for the latest curriculum updates.";
      }
    }

    // INTENT: Peer Network (Experts)
    else if (query.includes("expert") || query.includes("person") || query.includes("help") || query.includes("mentor") || query.includes("knows") || query.includes("someone")) {
      const expertsFound = await User.find({ 
        $or: [
          { skills: { $regex: query, $options: 'i' } },
          { learningTrack: { $regex: query, $options: 'i' } }
        ],
        role: 'student'
      }).limit(3);

      if (expertsFound.length > 0) {
        response = `I've mapped your request to ${expertsFound.length} verified peer mentors in the network. Connecting with them will accelerate your growth:`;
        suggestions = expertsFound.map(e => ({ title: e.name, type: 'expert', track: e.learningTrack }));
      } else {
        response = "I'm currently scouring the network nodes for an expert match. In the meantime, you can post a 'Challenge' in the Community Board.";
      }
    }

    // INTENT: Growth Audit (Credits/Milestones)
    else if (query.includes("credit") || query.includes("point") || query.includes("milestone") || query.includes("rank") || query.includes("improve") || query.includes("grow")) {
      response = "Your professional evolution is tracked via 'Impact Points'. To rank up quickly, I suggest transmitting a 'Lesson Learned' (+20 Pts) or pitching a new 'Innovation Idea' (+15 Pts). Would you like to start a contribution now?";
    }

    // INTENT: Meta / Appreciation
    else if (query.includes("thanks") || query.includes("thank you") || query.includes("cool") || query.includes("awesome")) {
      response = "Acknowledged. My purpose is to optimize your learning trajectory. Is there anything else you need to retrieve before you dive back into your work?";
    }

    // FALLBACK
    else {
      response = "Analysis incomplete. I am AURA, optimized for 'Resource Retrieval', 'Expert Mapping', and 'Growth Audits'. Please specify if you are looking for assistance in one of those vectors.";
    }

    // Simulate "Real Chatbot" variability by adding slight personality variations
    const suffixes = ["", " Proceed with focus.", " The network is with you.", " Logic suggests high ROI on this path."];
    response += suffixes[Math.floor(Math.random() * suffixes.length)];

    res.json({ response, suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
