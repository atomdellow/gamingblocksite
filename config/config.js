const dotenv = require('dotenv');
const path = require('path');

// Load the correct .env file based on NODE_ENV
const environment = process.env.NODE_ENV || 'development';
const envFile = `.env.${environment}`;

console.log(`Using environment: ${environment}`);
console.log(`Loading config from: ${envFile}`);

// Load environment variables from file
dotenv.config({
  path: path.resolve(process.cwd(), envFile)
});

// Export the configuration as an object
module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
  
  // Add more configurations as needed
  clientUrl: process.env.CLIENT_URL || 'http://localhost:8080',
  apiPrefix: process.env.API_PREFIX || '/api',
  
  // JWT token expiration (in seconds)
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  
  // File upload limits
  maxFileSize: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
  
  // Cookie settings
  cookieExpire: parseInt(process.env.COOKIE_EXPIRE || (24 * 60 * 60 * 1000)), // 1 day
  cookieSecure: process.env.COOKIE_SECURE === 'true'
};
