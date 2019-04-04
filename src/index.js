const express = require('express');
const app = express();
const keys = require('./config');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const serverless = require('serverless-http');

app.use(express.json({
  limit: '50mb'
}));
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

require('./models/userModel');
require('./models/profileModel');

require('./services/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());


app.use(session({
  secret: keys.tokenSecret,
  saveUninitialized: true,
  resave: true
}))




app.use('/auth', require('./routes/authRoute')(passport));
app.use('/profile', require('./routes/profileRoutes')(passport))


app.listen(process.env.PORT || 3001);

module.exports.handler = serverless(app);