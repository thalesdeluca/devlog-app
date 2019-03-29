const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
  method: String
});

module.exports = mongoose.model('user', userSchema);