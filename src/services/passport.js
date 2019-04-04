const GoogleStrategy = require('passport-google-oauth2').Strategy;  
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const keys = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Profile = mongoose.model('profile');
const bcrypt = require('bcrypt');

const generateUsername = async (name) => {
  let nameGenerated = name;
  do {
    const nameCheck = await Profile.findOne({ displayName: nameGenerated });
    if(nameCheck) {
      const number = Math.random() * (10000000); 
      nameGenerated = name + "#" + number;
    } else {
      break;
    }
  } while(true);

  return nameGenerated;
}

module.exports = passport => { 
  passport.use(new GoogleStrategy({
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: keys.googleCallbackURI,
      passReqToCallback: true

    }, async (req, accessToken, refreshToken, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });

      if(!user) {
        const username = await generateUsername(profile.displayName);

        const prof = await new Profile({
          displayName: username,
          intro: ""
        }).save();

        user = await new User({
          email: profile.email,
          googleId: profile.id,
          profileId: prof._id,
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
    callbackURL: keys.facebookCallbackURI,
    passReqToCallback: true,
    profileFields: ['id','emails','name']

  }, async (req, accessToken, refreshToken, profile, done) => {
    let user = await User.findOne({ facebookId: profile.id });

    
    if(!user) {
      const username = await generateUsername(profile.name.givenName);

      const prof = await new Profile({
        displayName: username,
        intro: ""
      }).save();

      user = await new User({
        email: profile.emails[0].value,
        facebookId: profile.id,
        profileId: prof._id,
        method: 'facebook'
      }).save();
    }

    return done(null, user);
  }));

  passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, (err, user) => {
      return done(err, user);
    });
  })
};