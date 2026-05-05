require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI;

async function initAdmin() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: 'gym_zone' });
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@gymzone.ma';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin already exists');
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log('Ensured user has admin role');
    } else {
      await User.create({
        name: 'Admin Gym Zone',
        email: adminEmail,
        password: 'adminpassword123',
        role: 'admin'
      });
      console.log('Admin created: email: admin@gymzone.ma, password: adminpassword123');
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

initAdmin();
