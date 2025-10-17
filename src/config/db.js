const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('La base de données est connectée');
  } catch (err) {
    console.error('Problème lors de connection avec la base de données: ', err);
    process.exit(1);
  }
};

module.exports = connectDB;