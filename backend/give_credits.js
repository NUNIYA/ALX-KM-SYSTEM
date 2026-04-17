require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const giveCredits = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb+srv://kmalx_db_user:KMPORTALALX@cluster0.w9nzivi.mongodb.net/alx_km_db');
    console.log('MongoDB Connected...');

    // Update all users to have 500 KCR credits automatically
    const result = await User.updateMany({}, { $set: { credits: 500 } });
    
    console.log(`Successfully updated ${result.modifiedCount} users to 500 KCR!`);
    process.exit();
  } catch (error) {
    console.error('Error updating credits:', error);
    process.exit(1);
  }
};

giveCredits();
