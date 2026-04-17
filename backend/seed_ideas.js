require('dotenv').config();
const mongoose = require('mongoose');
const Idea = require('./models/Idea');

const seedIdeas = async () => {
  try {
    const mongoStr = process.env.MONGO_URI || 'mongodb+srv://kmalx_db_user:KMPORTALALX@cluster0.w9nzivi.mongodb.net/alx_km_db';
    await mongoose.connect(mongoStr);
    console.log('MongoDB Connected for Ideas...');

    await Idea.deleteMany({}); // Wipe old samples

    const samples = [
      {
        title: 'Peer-to-Peer Mock Interview Platform',
        description: 'An internal platform where ALX students can schedule random peer mock interviews using preset rubrics. This eliminates the reliance on facilitators for basic technical practice.',
        category: 'Software Engineering',
        tags: ['P2P', 'React', 'WebRTC'],
        author: 'Elias T.',
        likes: 142,
        status: 'implemented'
      },
      {
        title: 'AI Diagnostic for LeetCode Prep',
        description: 'Integrate a small GPT wrapper that reviews failed HackerRank submissions and provides Socratic hints instead of direct answers, fostering better problem-solving skills.',
        category: 'AI',
        tags: ['OpenAI', 'Education', 'Algorithhms'],
        author: 'Marta D.',
        likes: 87,
        status: 'approved'
      },
      {
        title: 'Localized Dataset Generation Engine',
        description: 'A shared repository for generating structured synthetic datasets modeled after Ethiopian use-cases (e.g., Amharic NLP corpus, Ethiopian stock market mock data) for curriculum projects.',
        category: 'Data Analytics',
        tags: ['Python', 'Synthetic Data', 'Localization'],
        author: 'Kidus W.',
        likes: 54,
        status: 'pending'
      },
      {
        title: 'Mentorship Bounty Protocol',
        description: 'Implement a smart-contract or simple point-based bounty board where alumni can offer 1-hour coaching sessions in exchange for ALX portal credits and community badges.',
        category: 'Career Development',
        tags: ['Web3', 'Community', 'Gamification'],
        author: 'Sara Tadesse',
        likes: 91,
        status: 'pending'
      },
      {
        title: 'Mental Health & Burnout Radar',
        description: 'A weekly check-in tool via Slack bot that gauges student wellness. Data is anonymized and aggregated onto a dashboard so HQ can detect cohort-wide burnout before dropouts occur.',
        category: 'Soft Skills',
        tags: ['Slack API', 'Wellbeing', 'Data Visualization'],
        author: 'Liya Hailu',
        likes: 215,
        status: 'implemented'
      }
    ];

    await Idea.insertMany(samples);
    console.log(`✅ Inserted ${samples.length} sample ideas into the database.`);
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedIdeas();
