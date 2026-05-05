const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        googleId: sub,
        role: 'user', // Default role
        // For Google users, we set a dummy password that they'll never use
        password: Math.random().toString(36).slice(-10) + 'Aa1!',
      });
    } else if (!user.googleId) {
      // If user exists but wasn't a Google user, link the account
      user.googleId = sub;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'your_default_secret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        picture,
      },
    });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ message: 'Erreur d\'authentification Google', error: err.message });
  }
});

module.exports = router;
