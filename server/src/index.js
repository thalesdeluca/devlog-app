const express = require('express');
const app = express();
const keys = require('./config');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');

app.use(express.json());
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });

require('./models/userModel');

require('./services/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());


app.use(session({
  secret: keys.tokenSecret,
  saveUninitialized: true,
  resave: true
}))




app.use('/auth', require('./routes/authRoute')(passport));
app.get('/', (req, res) => {
  res.send(passport);
})

app.listen(process.env.PORT || 3001);