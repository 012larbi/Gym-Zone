const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_default_secret');

    // Only hit DB if the JWT role claim isn't enough, or for extra security
    // For performance, use lean() to skip Mongoose document instantiation
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Administrateur uniquement.' });
    }

    // Lean query — returns plain JS object, ~2x faster than full Mongoose doc
    const user = await User.findById(decoded.id).select('_id name email role').lean();
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé. Administrateur uniquement.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Error:', err.message);
    res.status(401).json({ message: 'Session expirée ou jeton invalide' });
  }
};

module.exports = { isAdmin };
