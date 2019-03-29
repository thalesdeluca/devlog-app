const GoogleStrategy = require('passport-google-oauth2').Strategy;  
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const bcrypt = require('bcrypt');


module.exports = passport => { 
  passport.use(new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: 'http://localhost:3001/auth/google/callback',
      passReqToCallback: true
    }, async (accessToken, refreshToken, profile, done) => {
      const user = await User.findOne({ googleId: profile.id });

      if(user) {
        user = new User({
          email: profile.email,
          googleId: profile.id,
          method: 'google'
        }).save();
      }

      return done(null, user);
    }));

  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'

    },
    async (email, password, done) => {
      const user = await User.findOne({ email: email });

      if(user) {
        const passCheck = await bcrypt.compare(password, user.password);
        if(passCheck) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect Password"})
        }
      } else {
        return done(null, false, { message: "Not Found"});
      }
    }
  ));

  passport.use(new FacebookStrategy({
    clientID: keys.facebookClientID,
    clientSecret: keys.facebookClientSecret,
    callbackURL: 'http://localhost:3001/auth/facebook/callback',
    passReqToCallback: true,
    profileFields: ['id','emails','name']

  }, async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ facebookId: profile.id });

    if(!user) {
      user = await new User({
        email: profile.emails[0],
        facebookId: profile.id,
        method: 'facebook'
      }).save();
      return done(null, user);
    }

    return done(null, user);
  }))
};