const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('Connection error: ', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`The server is running on port ${PORT}`));