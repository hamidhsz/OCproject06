//The schema uses the mongoose-unique-validator plugin to validate that the email is unique.

const mongoose = require('mongoose'); 
const uniqueValidator = require('mongoose-unique-validator'); // validation for unique fields in Mongoose schemas

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //adding validator to userSchema

module.exports = mongoose.model('User', userSchema);