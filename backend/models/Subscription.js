const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Fast populate and per-user lookups
  },
  plan: {
    type: String,
    enum: ['Basic', 'Pro', 'Elite'],
    required: true,
    index: true, // Fast plan-distribution aggregation
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'completed', 'pending'],
    default: 'active',
    index: true, // Fast filter by status
  },
  startDate: {
    type: Date,
    default: Date.now,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Subscription', subscriptionSchema);
