const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ['income', 'expense', 'none'],
    default: 'none'
  }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);
