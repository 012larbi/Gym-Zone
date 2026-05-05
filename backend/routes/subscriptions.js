const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User'); // Required for population to work reliably

const { isAdmin } = require('../utils/authMiddleware');

// GET all subscriptions (Real data only)
router.get('/', isAdmin, async (req, res) => {
  try {
    const subs = await Subscription.find().populate('userId', 'name email').sort({ createdAt: -1 });
    // Flatten for frontend
    const formatted = subs.map(s => ({
      ...s.toObject(),
      userName: s.userId?.name || 'Inconnu',
      userEmail: s.userId?.email || 'N/A'
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: err.message });
  }
});

// UPDATE subscription status
router.put('/:id/status', isAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const sub = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: 'Error updating status', error: err.message });
  }
});

module.exports = router;
