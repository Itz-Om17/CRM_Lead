const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');

const seedDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-crm';
    await mongoose.connect(dbUri);
    console.log('MongoDB connected for seeding...');

    const existingUser = await User.findOne({ username: 'test123' });
    if (!existingUser) {
      await User.create({
        name: 'Test User',
        username: 'test123',
        password: 'test123'
      });
      console.log('Default user "test123" created successfully.');
    } else {
      console.log('Default user "test123" already exists. Skipping...');
    }

    console.log('Seed complete');
  } catch (error) {
    console.error('Seed failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

seedDB();
