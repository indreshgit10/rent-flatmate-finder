require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const seedAdmin = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      console.log('An admin user already exists. Email:', adminExists.email);
      process.exit(0);
    }

    console.log('No admin found. Creating default admin...');
    const admin = new User({
      name: 'System Admin',
      email: 'admin@rentmatch.com',
      password: 'SuperSecurePassword123!',
      role: 'admin',
    });

    await admin.save();
    console.log('Default admin user created successfully!');
    console.log('--------------------------------------------------');
    console.log('Email: admin@rentmatch.com');
    console.log('Password: SuperSecurePassword123!');
    console.log('--------------------------------------------------');
    console.log('Please log in and change this password immediately.');
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
};

seedAdmin();
