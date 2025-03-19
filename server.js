const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
// Gaming Blog Site Server
// Load env vars
dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
});
// Staging Version
// Connect to database
connectDB();

const app = express();

// CORS configuration based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com'
    : ['http://localhost:5173', 'https://gbs-staging.herokuapp.com'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Mount routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/comments', require('./routes/commentRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));

// Serve static assets if in production
if (['production', 'staging'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));
