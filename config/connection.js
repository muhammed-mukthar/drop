const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectToDatabase = () => {
  const MONGO_URL = process.env.MONGO_URL;

  mongoose.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  const db = mongoose.connection;

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error);
  });

  db.once('open', () => {
    console.log('Connected to MongoDB');
  });

  return db;
};

module.exports = { connectToDatabase };
