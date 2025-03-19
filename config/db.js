const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('Attempting MongoDB connection in environment:', process.env.NODE_ENV);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4  // Force IPv4
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Add connection error handler
    conn.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    return conn;
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    if (process.env.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;