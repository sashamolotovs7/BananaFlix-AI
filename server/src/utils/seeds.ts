import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');

    console.log('Database connected.');

    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users cleared.');

    // Seed new users
    const users = [
      {
        username: 'testuser1',
        email: 'testuser1@example.com',
        password: await bcrypt.hash('password123', 10),
      },
      {
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: await bcrypt.hash('password123', 10),
      },
    ];

    await User.insertMany(users);
    console.log('Test users seeded.');

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
