const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const User = require('../models/User');
const Lead = require('../models/Lead');

// Sample leads owned by test123
const test123Leads = [
  {
    name: 'Ananya Sharma',
    email: 'ananya.sharma@techcorp.in',
    phone: '9876543210',
    company: 'TechCorp Solutions',
    status: 'New',
    notes: 'Interested in enterprise CRM plan. Follow up next week.'
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@innovate.io',
    phone: '8765432109',
    company: 'Innovate.io',
    status: 'Contacted',
    notes: 'Had initial call. Wants a product demo scheduled for Friday.'
  },
  {
    name: 'Divya Nair',
    email: 'divya.nair@brightedge.in',
    phone: '7654321098',
    company: 'BrightEdge Marketing',
    status: 'Qualified',
    notes: 'Budget approved. Decision expected by end of month.'
  },
  {
    name: 'Kiran Patel',
    email: 'kiran.patel@globalretail.in',
    phone: '6543210987',
    company: 'Global Retail India',
    status: 'Converted',
    notes: 'Signed annual contract. Onboarding starts next Monday.'
  }
];

// Sample leads owned by demo456
const demo456Leads = [
  {
    name: 'Priya Kapoor',
    email: 'priya.kapoor@startupx.in',
    phone: '9988776655',
    company: 'StartupX India',
    status: 'Qualified',
    notes: 'Met at SaaS conference. Very interested — needs team approval.'
  },
  {
    name: 'Arjun Singhania',
    email: 'arjun.singhania@nexusgroup.in',
    phone: '8877665544',
    company: 'Nexus Group India',
    status: 'Lost',
    notes: 'Went with a competitor. May revisit in Q3.'
  }
];

const seedDB = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-crm';
    await mongoose.connect(dbUri);
    console.log('MongoDB connected for seeding...');

    // ── User 1: test123 ──
    let user1 = await User.findOne({ username: 'test123' });
    if (!user1) {
      user1 = await User.create({ name: 'Test User', username: 'test123', password: 'test123' });
      console.log('User "test123" created.');
    } else {
      console.log('User "test123" already exists. Skipping...');
    }

    const user1LeadCount = await Lead.countDocuments({ createdBy: user1._id });
    if (user1LeadCount === 0) {
      await Lead.insertMany(test123Leads.map((l) => ({ ...l, createdBy: user1._id })));
      console.log(`${test123Leads.length} leads seeded for "test123".`);
    } else {
      console.log(`"test123" already has ${user1LeadCount} leads. Skipping lead seeding...`);
    }

    // ── User 2: demo456 ──
    let user2 = await User.findOne({ username: 'demo456' });
    if (!user2) {
      user2 = await User.create({ name: 'Demo User', username: 'demo456', password: 'demo456' });
      console.log('User "demo456" created.');
    } else {
      console.log('User "demo456" already exists. Skipping...');
    }

    const user2LeadCount = await Lead.countDocuments({ createdBy: user2._id });
    if (user2LeadCount === 0) {
      await Lead.insertMany(demo456Leads.map((l) => ({ ...l, createdBy: user2._id })));
      console.log(`${demo456Leads.length} leads seeded for "demo456".`);
    } else {
      console.log(`"demo456" already has ${user2LeadCount} leads. Skipping lead seeding...`);
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
