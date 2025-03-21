const mongoose = require('mongoose')

module.exports = async () => {
    try {
      await mongoose.connect('mongodb://localhost:27017/lazynote', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      console.log('Connected to MongoDB successfully');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1); // Exit process with failure
    }
}