const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

const connectDB = require('./config/db'); 
connectDB();

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api/v1/', authRoutes);



app.get('/', (req, res) => {
  res.send('Bienvenue sur E-Sihha Connect API');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Le serveur fonctionne sur le port ${PORT}`));