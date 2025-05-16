const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  loai: { type: String, enum: ['thu', 'chi', 'khac'], required: true },
  so_tien: { type: Number, default: 0 },
  mo_ta: { type: String, default: 'others' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Record', recordSchema); 