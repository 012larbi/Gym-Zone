const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

async function test() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gym_zone' });
    console.log('Connected');
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const growth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);
    console.log('Growth:', growth);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

test();
