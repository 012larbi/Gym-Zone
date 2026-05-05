const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  action: String,
  details: String,
  metadata: {
    type: mongoose.Schema.Types.Mixed,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true, // Fast sort for recent activity
  },
});

module.exports = mongoose.model('Activity', activitySchema);
