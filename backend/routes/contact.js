const express = require('express');
const router = express.Router();

// POST /api/contact - Send contact message (logged to console, can be extended with email)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }
    // In production: send email, save to DB, etc.
    console.log('Contact message received:', { name, email, message });
    res.status(200).json({ message: 'Message envoyé avec succès!' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
