const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  selectedPlan: {
    type: String,
    enum: ['Basic', 'Pro', 'Elite'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Registration', registrationSchema);
