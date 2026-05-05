const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Content = require('../models/Content');
const Activity = require('../models/Activity');
const Service = require('../models/Service');
const Message = require('../models/Message'); // was missing — caused crashes

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB (was 50MB)
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|webm/;
    const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
    cb(ok ? null : new Error('Invalid file type'), ok);
  }
});

const { isAdmin } = require('../utils/authMiddleware');

const logActivity = async (adminId, action, details) => {
  try {
    await Activity.create({ adminId, action, details, type: action, description: details });
  } catch (err) {
    console.error('Logging failed:', err);
  }
};

// Verify admin token
router.get('/verify', isAdmin, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// --- STATISTICS ---
router.get('/stats', isAdmin, async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // All counts in parallel — single round-trip
    const [userCount, subCount, serviceCount, messageCount, activeSubs, growth] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Subscription.countDocuments(),
      Service.countDocuments(),
      Message.countDocuments({ status: 'unread' }),
      Subscription.find({ status: 'active' }).select('plan').lean(), // lean + projection
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ])
    ]);

    const planPrices = { Basic: 300, Pro: 500, Elite: 900 };
    const revenue = activeSubs.reduce((sum, sub) => sum + (planPrices[sub.plan] || 0), 0);
    const growthData = growth.map(g => ({ date: g._id, users: g.count }));

    res.json({ users: userCount, subscriptions: subCount, services: serviceCount, revenue, unreadMessages: messageCount, growth: growthData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- MESSAGES ---
router.post('/messages', async (req, res) => {
  try {
    const msg = await Message.create(req.body);
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/messages', isAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).lean();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/messages/:id', isAdmin, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(req.params.id, { status: 'read' }, { new: true });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- UPLOAD ---
router.post('/upload', isAdmin, upload.single('media'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Aucun fichier' });
  const baseUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  res.json({ url: `${baseUrl}/uploads/${req.file.filename}` });
});

// --- SERVICES ---
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1 }).lean(); // lean for read-only
    res.set('Cache-Control', 'public, max-age=60'); // Cache 1 min on CDN/proxy
    res.json(services || []);
  } catch (err) {
    res.json([]);
  }
});

router.post('/services', isAdmin, async (req, res) => {
  try {
    const service = await Service.create(req.body);
    await logActivity(req.user._id, 'CREATE_SERVICE', `Nouveau service: ${service.title}`);
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/services/:id', isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity(req.user._id, 'UPDATE_SERVICE', `Mise à jour service: ${service.title}`);
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/services/:id', isAdmin, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    await logActivity(req.user._id, 'DELETE_SERVICE', `Suppression service: ${service.title}`);
    res.json({ message: 'Supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- CONTENT CMS ---
router.get('/content', async (req, res) => {
  try {
    const content = await Content.find().lean(); // lean for read-only
    res.set('Cache-Control', 'public, max-age=60');
    res.json(content || []);
  } catch (err) {
    res.json([]);
  }
});

router.post('/content', isAdmin, async (req, res) => {
  const { key } = req.body;
  const content = await Content.findOneAndUpdate(
    { key },
    { ...req.body, updatedAt: Date.now() },
    { upsert: true, new: true }
  );
  await logActivity(req.user._id, 'UPDATE_CONTENT', `Mise à jour CMS: ${key}`);
  res.json(content);
});

// --- USERS ---
router.get('/users', isAdmin, async (req, res) => {
  try {
    // Project only needed fields, use lean
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

router.delete('/users/:id', isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SUBSCRIPTIONS ---
router.get('/subscriptions', isAdmin, async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate('userId', 'name email') // only fetch needed fields
      .sort({ createdAt: -1 })
      .lean();
    const formatted = subs.map(s => ({
      ...s,
      userName: s.userId?.name || 'Inconnu',
      userEmail: s.userId?.email || 'N/A'
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: err.message });
  }
});

router.put('/subscriptions/:id', isAdmin, async (req, res) => {
  try {
    const sub = await Subscription.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('userId', 'name');
    await logActivity(req.user._id, 'UPDATE_SUB', `Statut abonnement: ${sub.userId?.name} -> ${req.body.status}`);
    res.json(sub);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- ACTIVITY ---
router.get('/activity', isAdmin, async (req, res) => {
  try {
    const activities = await Activity.find().sort({ createdAt: -1 }).limit(30).lean();
    res.json(activities);
  } catch (err) {
    res.json([]);
  }
});

module.exports = router;
