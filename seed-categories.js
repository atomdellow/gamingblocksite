require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

// Sample categories for console gaming blog
const categories = [
  {
    name: 'PlayStation',
    description: 'News, reviews, and discussions about PlayStation consoles and games'
  },
  {
    name: 'Xbox',
    description: 'Everything related to Xbox consoles, games, and services'
  },
  {
    name: 'Nintendo',
    description: 'Nintendo Switch, games, and Nintendo-related content'
  },
  {
    name: 'PC Gaming',
    description: 'PC gaming topics, hardware, and software'
  },
  {
    name: 'Mobile Gaming',
    description: 'Games and news about mobile gaming on smartphones and tablets'
  },
  {
    name: 'Industry News',
    description: 'General gaming industry news, trends, and events'
  },
  {
    name: 'Reviews',
    description: 'In-depth reviews of games across all platforms'
  },
  {
    name: 'Guides & Tips',
    description: 'Helpful guides, walkthroughs, and tips for games'
  }
];

const seedCategories = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to MongoDB');
    
    // Check if categories exist
    const existingCount = await Category.countDocuments();
    console.log(`Found ${existingCount} existing categories`);
    
    if (existingCount > 0) {
      console.log('Categories already exist in database. Skipping seed.');
      return;
    }
    
    // Insert the categories
    const result = await Category.insertMany(categories);
    console.log(`Successfully seeded ${result.length} categories`);
    
  } catch (error) {
    console.error('Error seeding categories:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run the seed function
seedCategories();
