require('dotenv').config();
const mongoose = require('mongoose');
const Post = require('./models/Post');

const seedPosts = async () => {
  try {
    const mongoStr = process.env.MONGO_URI || 'mongodb+srv://kmalx_db_user:KMPORTALALX@cluster0.w9nzivi.mongodb.net/alx_km_db';
    await mongoose.connect(mongoStr);
    console.log('MongoDB Connected for Posts...');

    await Post.deleteMany({}); // Wipe old sample data

    const samples = [
      {
        title: 'How do I effectively integrate Redux with React 18 Concurrent Mode?',
        content: 'I have been facing random re-renders when using standard Redux hooks in the new React Concurrent mode for my capstone project. Should I be switching to Zustand or is there a specific middleware solution to lock state reads during transitions?',
        postType: 'Question',
        category: 'Software Engineering',
        tags: ['React', 'Redux', 'State Management'],
        author: 'Elias T.',
        viewCount: 245
      },
      {
        title: '🚀 Upcoming Hackathon: Building Tools for African Agriculture',
        content: 'Hey everyone! ALX is hosting a weekend hackathon starting next Friday. The focus is exclusively on using Data Analytics and basic Machine Learning to optimize crop yield predictions using open climatic datasets. Prize pool includes AWS credits and mentorship with top faculty.',
        postType: 'Announcement',
        category: 'Data Analytics',
        tags: ['Hackathon', 'AgriTech', 'Event'],
        author: 'Staff / Admin',
        authorRole: 'admin',
        isPinned: true,
        viewCount: 1520
      },
      {
        title: 'Best Practices for Containerizing Flask Apps using Docker',
        content: 'I noticed many people struggling with heavy Docker images for backend projects. Pro tip: Always use an Alpine base image like python:3.9-alpine. It reduces the final image size from ~900MB down to ~150MB! Also, remember to use multi-stage builds if your requirements.txt needs GCC to compile headers.',
        postType: 'Knowledge Share',
        category: 'Software Engineering',
        tags: ['Docker', 'Flask', 'DevOps'],
        author: 'Kidus W.',
        viewCount: 89
      },
      {
        title: 'Understanding the Bias-Variance Tradeoff in pure simple terms',
        content: 'Think of Bias as your model being too stubborn to learn (Underfitting). Think of Variance as your model having no anchor, wildly changing its rules for every new data point (Overfitting). The goal is to find the sweet spot where it learns the underlying pattern without memorizing the noise.',
        postType: 'Knowledge Share',
        category: 'AI',
        tags: ['Machine Learning', 'Data Science', 'Concepts'],
        author: 'Marta D.',
        viewCount: 412
      },
      {
        title: 'Advice on passing the behavioral interview stage?',
        content: 'I have made it past the technical screens for two separate companies, but I keep getting rejected after the final behavioral interview. Does anyone have a specific framework they use to answer "Tell me about a time you failed" questions effectively?',
        postType: 'Question',
        category: 'Soft Skills',
        tags: ['Interviews', 'Career', 'Behavioral'],
        author: 'Sara Tadesse',
        viewCount: 301
      }
    ];

    await Post.insertMany(samples);
    console.log(`✅ Inserted ${samples.length} sample posts into the database.`);
    process.exit();
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedPosts();
