/**
 * Usage: node make_admin.js your@email.com
 * This script promotes a user to admin role in MongoDB.
 * If the user doesn't exist yet, it creates an admin account.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const email = process.argv[2];

if (!email) {
  console.error('❌ Please provide an email: node make_admin.js your@email.com');
  process.exit(1);
}

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, lowercase: true },
  password: String,
  phone: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  googleId: { type: String, sparse: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

async function makeAdmin() {
  try {
    console.log(`🔌 Connecting to MongoDB: ${process.env.MONGODB_URI}`);
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gym_zone' });
    console.log('✅ Connected to MongoDB\n');

    let user = await User.findOne({ email: email.toLowerCase() });

    if (user) {
      // User exists — just promote to admin
      user.role = 'admin';
      await user.save();
      console.log(`✅ SUCCESS! "${user.name || user.email}" has been promoted to ADMIN.`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Role:  ${user.role}`);
    } else {
      // User doesn't exist — create a new admin account
      const hashedPassword = await bcrypt.hash('AdminGymZone2024!', 12);
      user = await User.create({
        name: 'Admin',
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`✅ SUCCESS! New admin account created.`);
      console.log(`   Email:    ${user.email}`);
      console.log(`   Password: AdminGymZone2024!`);
      console.log(`   Role:     ${user.role}`);
      console.log('\n⚠️  Please change the password after your first login.');
    }

    console.log('\n🚀 You can now log in at: http://localhost:5173/admin/login');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeAdmin();
