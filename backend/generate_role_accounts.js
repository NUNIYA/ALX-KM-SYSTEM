require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://kmalx_db_user:KMPORTALALX@cluster0.w9nzivi.mongodb.net/alx_km_db');
    console.log('MongoDB Connected...');

    const accounts = [
      {
        name: 'ALX Student',
        email: 'student@gmail.com',
        role: 'student',
        learningTrack: 'Software Engineering',
        skills: ['React', 'Node.js', 'Python'],
      },
      {
        name: 'ALX Facilitator',
        email: 'mentor@gmail.com',
        role: 'facilitator',
        learningTrack: 'Software Engineering',
        skills: ['Architecture', 'Mentorship', 'DevOps'],
      },
      {
        name: 'ALX Admin',
        email: 'admin@gmail.com',
        role: 'admin',
        learningTrack: 'System Operations',
        skills: ['System Design', 'Management', 'Moderation'],
      }
    ];

    for (let acc of accounts) {
      let user = await User.findOne({ email: acc.email });
      if (!user) {
         const newUser = new User({
            ...acc,
            password: 'password123',
            credits: 500
         });
         await newUser.save();
         console.log(`Created ${acc.role} account: ${acc.email}`);
      } else {
         // Force update to Ensure properties map properly
         user.role = acc.role;
         user.learningTrack = acc.learningTrack;
         await user.save();
         console.log(`Updated ${acc.role} account: ${acc.email}`);
      }
    }

    console.log('\n=============================');
    console.log('student@gmail.com  / password123');
    console.log('mentor@gmail.com   / password123');
    console.log('admin@gmail.com    / password123');
    console.log('=============================\n');

    process.exit();
  } catch (error) {
    console.error('Error seeding test accounts:', error);
    process.exit(1);
  }
};

seedUsers();
