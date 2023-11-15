
// Node.js module that sets up routes for user signup and login using the Express framework

const express = require('express');
const router = express.Router(); //Express router
const {signup, login} = require('../controllers/userController'); //importing signup and login from the controller 


// Route for user signup (creating an account)
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

module.exports = router;
