
const User = require('../models/user');
const bcrypt = require('bcrypt'); //bcrypt for password hashing
const jwt = require('jsonwebtoken'); // jwt for token generation

//singup functoin: 
exports.signup = (req, res, next) => {
  //Hashing the password inserted by the user
    bcrypt.hash(req.body.password, 10).then(
      (hash) => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save().then( //saves the user to the database using the save method
          () => {
            res.status(201).json({
              message: 'User added!'
            });
          }
        ).catch(
          (error) => {
            res.status(500).json({
              error: error
            });
          }
        );
      }
    );
  };
//login function: 
  exports.login = (req, res, next) => {
    //Finding the user with the same email inserted by the user
      User.findOne({ email: req.body.email })
      .then((user) => {
          //If the user doesn't exist throw an error
          if (user === null) {
            // console.error('User not found!');
            return res.status(401).json({
              error: new Error('User not found!')
            });
          }
          //Checking if the password is correct by comparing the valid one with the one inserted by the user
          bcrypt.compare(req.body.password, user.password).then(
            (valid) => {
              //If the password is not correct throw an error
              if (!valid) {
                // console.error('Incorrect password!');
                return res.status(401).json({
                  error: new Error('Incorrect password!')
                });
              }
              //If the password is correct send back the authentication token
              const token = jwt.sign(
                { userId: user._id }, //Data we want to encode into the token
                'RANDOM_TOKEN_SECRET', //Secret hashing key
                { expiresIn: '24h' });
              res.status(200).json({
                userId: user._id,
                token: token
              });
            }
          ).catch(
            (error) => {
              res.status(500).json({
                error: error
              });
            }
          );
        }
      ).catch(
        (error) => {
          res.status(500).json({
            error: error
          });
        }
      );
  };

