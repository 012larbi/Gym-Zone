const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Service = require('../models/Service');
const { isAdmin } = require('../utils/authMiddleware');

// GET dashboard stats
router.get('/dashboard', isAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // All queries in parallel — no sequential awaits
    const [users, subscriptions, services, pendingSubs, activeSubs, growth] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Subscription.countDocuments(),
      Service.countDocuments(),
      Subscription.countDocuments({ status: 'pending' }),
      Subscription.find({ status: 'active' }).select('plan').lean(),
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const planPrices = { Basic: 300, Pro: 500, Elite: 900 };
    const revenue = activeSubs.reduce((sum, sub) => sum + (planPrices[sub.plan] || 0), 0);
    const arpu = users > 0 ? (revenue / users).toFixed(2) : 0;

    // Fill gaps in growth data
    const growthData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = growth.find(g => g._id === dateStr);
      growthData.push({ date: dateStr, users: match ? match.count : 0 });
    }

    res.json({ users, subscriptions, services, revenue, pendingSubscriptions: pendingSubs, arpu, growth: growthData });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
});

// GET plan distribution
router.get('/plan-distribution', isAdmin, async (req, res) => {
  try {
    const distribution = await Subscription.aggregate([
      { $group: { _id: '$plan', count: { $sum: 1 } } }
    ]);
    res.json(distribution.map(item => ({ name: item._id, value: item.count })));
  } catch (err) {
    res.status(500).json({ message: 'Error calculating distribution', error: err.message });
  }
});

module.exports = router;
