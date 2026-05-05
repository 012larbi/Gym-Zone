const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');

// ============================================================
// ✏️  CHANGE THESE TWO LINES TO YOUR INFO:
const ADMIN_EMAIL = 'YOUR_EMAIL@gmail.com';   // ← put your email here
const ADMIN_NAME = 'Larbi';                   // ← put your name here
// ============================================================

async function seedAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gym_zone' });
    console.log('✅ Connected!\n');

    // Check if admin already exists
    let user = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (user) {
      // Already exists → just make sure role is admin
      if (user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
        console.log(`✅ "${ADMIN_NAME}" upgraded to ADMIN.`);
      } else {
        console.log(`ℹ️  "${ADMIN_EMAIL}" is already an admin.`);
      }
    } else {
      // Create new admin account
      const admin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL.toLowerCase(),
        password: 'AdminGymZone2024!', // hashed automatically
        role: 'admin',
      });
      await admin.save();
      console.log(`✅ Admin account created!`);
      console.log(`   Name:     ${ADMIN_NAME}`);
      console.log(`   Email:    ${ADMIN_EMAIL}`);
      console.log(`   Password: AdminGymZone2024!  ← change this after login`);
    }

    console.log('\n🚀 Login at: http://localhost:5173/admin/login');
    console.log('   Use "Se connecter avec Google" if this is your Google email.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedAdmin();
