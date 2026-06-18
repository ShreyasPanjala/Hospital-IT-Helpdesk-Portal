const mongoose = require('mongoose');

async function connectDb() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_helpdesk';
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

module.exports = connectDb;
