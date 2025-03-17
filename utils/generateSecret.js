const crypto = require('crypto');

// Generate a secure random string for JWT_SECRET
const generateSecret = () => {
  const secret = crypto.randomBytes(64).toString('hex');
  return secret;
};

const secret = generateSecret();
console.log('\n--- Your Secure JWT Secret ---');
console.log(secret);
console.log('\nCopy this value into your .env files\n');

module.exports = generateSecret;
