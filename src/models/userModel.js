const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  login: String,
  email: String,
  password: String,
  method: String,
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "profile"
  },
  googleId: Number,
  facebookId: Number
});

module.exports = mongoose.model('user', userSchema);