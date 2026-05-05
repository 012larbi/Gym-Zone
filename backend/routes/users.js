const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { isAdmin } = require('../utils/authMiddleware');

// GET all users — lean + no password in response
router.get('/', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

    const usersWithLoyalty = users.map(user => {
      const months = (Date.now() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24 * 30);
      const loyalty = months > 6 ? 'Gold' : months > 2 ? 'Silver' : 'Bronze';
      return { ...user, loyalty };
    });

    res.json(usersWithLoyalty);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users from MongoDB', error: err.message });
  }
});

// DELETE user
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});

module.exports = router;
