const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Check if error is related to connection refusal (often IP whitelist)
    if (error.message.includes('ECONNREFUSED') || error.message.includes('ENOTFOUND')) {
      console.error('Make sure your IP is whitelisted in MongoDB Atlas Network Access.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
