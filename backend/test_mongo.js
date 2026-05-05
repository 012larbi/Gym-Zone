const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection to:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Could not connect to MongoDB');
    console.error(err);
    process.exit(1);
  });

setTimeout(() => {
  console.log('TIMEOUT: Connection took too long');
  process.exit(1);
}, 10000);
