const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  displayName: String,
  profileImage: { data: Buffer, contentType: String },
  intro: String,
  projects: Array
})

mongoose.model('profile', profileSchema);