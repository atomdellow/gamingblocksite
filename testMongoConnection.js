require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log(`Connection URI: ${process.env.MONGO_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`); // Hide credentials in log

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Successfully connected to MongoDB!');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Failed to connect to MongoDB:');
  console.error(err);
});
