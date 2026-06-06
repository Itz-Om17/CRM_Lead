const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Lead = require('../models/Lead');

// Indian replacement data mapped by old email → new full record
const indianLeads = [
  {
    oldEmail: 'alice.johnson@techcorp.com',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@techcorp.in',
    phone: '9876543210',
    company: 'TechCorp Solutions',
    status: 'New',
    notes: 'Interested in enterprise CRM plan. Follow up next week.'
  },
  {
    oldEmail: 'rahul.sharma@innovate.io',
    name: 'Rohan Mehta',
    email: 'rohan.mehta@innovate.io',
    phone: '8765432109',
    company: 'Innovate.io',
    status: 'Contacted',
    notes: 'Had initial call. Wants a product demo scheduled for Friday.'
  },
  {
    oldEmail: 'emily.davis@brightedge.com',
    name: 'Divya Nair',
    email: 'divya.nair@brightedge.in',
    phone: '7654321098',
    company: 'BrightEdge Marketing',
    status: 'Qualified',
    notes: 'Budget approved. Decision expected by end of month.'
  },
  {
    oldEmail: 'michael.chen@globalretail.com',
    name: 'Kiran Patel',
    email: 'kiran.patel@globalretail.in',
    phone: '6543210987',
    company: 'Global Retail India',
    status: 'Converted',
    notes: 'Signed annual contract. Onboarding starts next Monday.'
  },
  {
    oldEmail: 'priya.kapoor@startupx.in',
    name: 'Priya Kapoor',
    email: 'priya.kapoor@startupx.in',
    phone: '9988776655',
    company: 'StartupX India',
    status: 'Qualified',
    notes: 'Met at SaaS conference. Very interested — needs team approval.'
  },
  {
    oldEmail: "james.obrien@nexusgroup.com",
    name: 'Arjun Singhania',
    email: 'arjun.singhania@nexusgroup.in',
    phone: '8877665544',
    company: 'Nexus Group India',
    status: 'Lost',
    notes: 'Went with a competitor. May revisit in Q3.'
  }
];

const updateLeads = async () => {
  try {
    const dbUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead-crm';
    await mongoose.connect(dbUri);
    console.log('MongoDB connected...');

    for (const lead of indianLeads) {
      const { oldEmail, ...newData } = lead;
      const result = await Lead.findOneAndUpdate(
        { email: oldEmail },
        { $set: newData },
        { new: true }
      );
      if (result) {
        console.log(`✔ Updated: "${result.name}" (${result.email})`);
      } else {
        console.log(`⚠ Not found: ${oldEmail} — skipping`);
      }
    }

    console.log('\nAll leads updated successfully.');
  } catch (err) {
    console.error('Update failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected.');
  }
};

updateLeads();
