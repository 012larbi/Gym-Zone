const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Subscription = require('./models/Subscription');
const Content = require('./models/Content');
const Service = require('./models/Service');
const Activity = require('./models/Activity');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gym_zone' });
    console.log('Connected to MongoDB for seeding...');

    // 1. Clear existing data (optional, but good for a fresh start)
    // await User.deleteMany({});
    // await Content.deleteMany({});
    // await Service.deleteMany({});
    // await Subscription.deleteMany({});
    // await Activity.deleteMany({});

    // 2. Create Admin if not exists
    const adminExists = await User.findOne({ email: 'admin@gymzone.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin Gym Zone',
        email: 'admin@gymzone.com',
        password: 'password123', // Will be hashed by pre-save hook
        role: 'admin'
      });
      console.log('Admin created: admin@gymzone.com / password123');
    }

    // 3. Create initial Content
    const initialContent = [
      { key: 'hero_title', value: 'DOMINEZ VOS LIMITES.', type: 'text', section: 'hero' },
      { key: 'hero_text', value: 'Une infrastructure de pointe, un coaching expert et une communauté de guerriers.', type: 'text', section: 'hero' },
      { key: 'plan_basic_price', value: '300', type: 'text', section: 'pricing' },
      { key: 'plan_pro_price', value: '500', type: 'text', section: 'pricing' },
      { key: 'plan_elite_price', value: '900', type: 'text', section: 'pricing' },
    ];

    for (const c of initialContent) {
      await Content.findOneAndUpdate({ key: c.key }, c, { upsert: true });
    }
    console.log('Initial content seeded');

    // 4. Create default Services
    const defaultServices = [
      { title: 'Musculation', description: 'Équipement Hammer Strength de dernière génération.', mediaUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48', mediaType: 'image', icon: 'fitness_center' },
      { title: 'Cardio Training', description: 'Tapis de course et vélos connectés avec suivi biométrique.', mediaUrl: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f', mediaType: 'image', icon: 'speed' },
      { title: 'Crossfit Area', description: 'Zone dédiée haute intensité pour repousser vos limites.', mediaUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', mediaType: 'image', icon: 'bolt' },
    ];

    for (const s of defaultServices) {
       const exists = await Service.findOne({ title: s.title });
       if (!exists) await Service.create(s);
    }
    console.log('Default services seeded');

    // 5. Create Mock Users & Subscriptions for stats
    const mockUsers = [
      { name: 'Yassine', email: 'yassine@test.com', password: 'password', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      { name: 'Sara', email: 'sara@test.com', password: 'password', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { name: 'Omar', email: 'omar@test.com', password: 'password', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ];

    for (const mu of mockUsers) {
      const uExists = await User.findOne({ email: mu.email });
      if (!uExists) {
        const user = await User.create(mu);
        await Subscription.create({
          userId: user._id,
          plan: ['Basic', 'Pro', 'Elite'][Math.floor(Math.random() * 3)],
          status: 'active',
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        await Activity.create({
          type: 'registration',
          description: `Inscription de ${user.name}`,
          userId: user._id,
          createdAt: user.createdAt
        });
      }
    }
    console.log('Mock data seeded');

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seed();
