const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Activity = require('../models/Activity');

// POST /api/register - Create new registration
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, selectedPlan } = req.body;

    if (!name || !email || !selectedPlan) {
      return res.status(400).json({ message: 'Nom, email et plan sont requis.' });
    }

    // Save registration record
    const registration = await Registration.create({ name, email, phone, selectedPlan });

    // Also create or update user account (without password for now)
    let user = await User.findOne({ email });
    if (!user) {
      // Create placeholder user - they'll set password later
      user = await User.create({
        name,
        email,
        phone,
        password: Math.random().toString(36).slice(-10) + 'Aa1!', // temp password
      });

      // Log activity
      await Activity.create({
        type: 'registration',
        description: `Nouvel utilisateur inscrit: ${name} (${selectedPlan})`,
      });

      // Create subscription for 1 month
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      await Subscription.create({
        userId: user._id,
        plan: selectedPlan,
        status: 'active',
        startDate: new Date(),
        endDate,
      });
    }

    res.status(201).json({
      message: 'Inscription réussie!',
      registration,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

// GET /api/register - List all registrations
router.get('/', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
