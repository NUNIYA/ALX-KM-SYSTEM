require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://kmalx_db_user:KMPORTALALX@cluster0.w9nzivi.mongodb.net/alx_km_db');
    console.log('MongoDB Connected...');

    const email = 'student@gmail.com';
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name: 'ALX Test User',
        email: email,
        password: 'password123', // Model hook should hash this
        role: 'student',
        skills: ['React', 'Node.js', 'MongoDB'],
        credits: 500
      });
      await user.save();
      console.log('Test user created successfully!');
    } else {
      console.log('Test user already exists!');
    }

    console.log('=============================');
    console.log('Email: student@gmail.com');
    console.log('Password: password123');
    console.log('=============================');

    process.exit();
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
};

createTestUser();
