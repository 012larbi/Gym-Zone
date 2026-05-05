const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Subscription = require('./models/Subscription');
const Service = require('./models/Service');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gym_zone' });
    const userCount = await User.countDocuments();
    const subCount = await Subscription.countDocuments();
    const serviceCount = await Service.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    console.log('--- Database Stats ---');
    console.log('Total Users:', userCount);
    console.log('Admins:', adminCount);
    console.log('Subscriptions:', subCount);
    console.log('Services:', serviceCount);
    
    if (adminCount === 0) {
      console.log('WARNING: No admin user found!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkData();
