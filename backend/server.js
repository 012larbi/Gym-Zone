require('dotenv').config();
const fs = require('fs');
fs.writeFileSync('started.txt', 'Server started at ' + new Date());
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// --- Security & Performance Middleware ---
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(compression()); // Gzip all responses — typically 60-80% smaller payloads

// Rate limiting — prevent abuse & reduce server load
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many login attempts, please try again later.' }
});

app.use(limiter);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // Reduced from 50mb — use multipart for files

// Cache static uploads for 7 days
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  maxAge: '7d',
  etag: true,
  lastModified: true,
}));

console.log('Connecting to MongoDB...');

// Routes
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', require('./routes/users'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/register', require('./routes/registration'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

// Connect to MongoDB with connection pooling
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: 'gym_zone',
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,     // Reuse connections — big win under load
    minPoolSize: 2,
    socketTimeoutMS: 45000,
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
