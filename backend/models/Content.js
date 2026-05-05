const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['text', 'image', 'video'],
    default: 'text',
  },
  section: {
    type: String,
    required: true,
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', contentSchema);
