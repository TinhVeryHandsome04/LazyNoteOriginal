const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(`mongodb://localhost:27017/lazynote`);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;