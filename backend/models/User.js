const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "student", enum: ["student", "facilitator", "admin"] },
  skills: { type: [String], default: [] },
  learningTrack: { type: String, default: 'General' },
  region: { type: String, enum: ['Addis Ababa', 'Oromia', 'Amhara', 'All'], default: 'All' },
  reputation: { type: Number, default: 0 },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
