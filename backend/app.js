const express = require('express');
const mongoose = require('mongoose');
const userRoute = require('./routes/userRout');
const saucesRoutes = require('./routes/sauces');
const path = require('path');
const cors = require('cors');


const app = express(); //adding the express like a function

// Connect to  MongoDB database
mongoose.connect('mongodb+srv://hamid:QH5Mgyb9pmL3Pkjn@cluster0.n4wgzfk.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });


// Middleware setup
app.use(express.json());

// CORS Policy - allows sharing between serversapp.use(cors());
app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoute);
app.use('/api/sauces', saucesRoutes);
module.exports = app;








