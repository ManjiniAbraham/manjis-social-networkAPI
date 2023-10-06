// seed.js
const connection = require('../config/connection'); // Import the database connection from your config file
const { User, Thought } = require('../models');
const { userData, thoughtData } = require('./data'); // Import data arrays


// Define a seeding function
async function seedDatabase() {
  try {
    // Clear existing data (optional, use if needed)
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Insert users
    const users = await User.insertMany(userData);

    // Insert thoughts
    for (const thought of thoughtData) {
      const user = users.find((u) => u.username === thought.username);
      thought.userId = user._id;
    }
    await Thought.insertMany(thoughtData);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the database connection
    connection.close();
  }
}

// Call the seed function to populate the database
seedDatabase();
