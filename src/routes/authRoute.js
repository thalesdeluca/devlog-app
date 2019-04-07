const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('user');
const Profile = mongoose.model('profile');
const bcrypt = require('bcrypt');
const argsCheck = require('../middlewares/argsCheck');
const router = express.Router();

const emailExists = async (email) => {
  const res = await User.find({ email: email });

  if(res.length > 0) {
    return true;
  }

  return false;
}

module.exports = passport => {
  router.use
  router.post("/signup", argsCheck('email', 'password'), async (req, res) => {
    const user = req.body;
    const emailCheck = await emailExists(user.email);

    if(emailCheck){
      res.sendStatus(409);
      return;
    }

    const safePass = await bcrypt.hash(user.password, 10)
    const profile = await new Profile({
      authId: user._id,
      displayName: user.email,
      intro: ""
    }).save()
      .catch(err => {
        res.send(err);
      });;

    await new User({
      email: user.email,
      password: safePass,
      profileId: profile._id,
      method: 'email'
    })
      .save()
      .then(() => {
        res.sendStatus(200);
      })
      .catch(err => {
        res.send(err);
      });
  });

  router.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }, (req, res) => {
  }));

  router.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }, (req, res) => {
  }));

  router.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect("/profile/me");
  });

  router.get('/login/callback',  passport.authenticate('local'), (req, res) => {
    res.redirect("/profile/me");
  });

  router.get('/google/callback',  passport.authenticate('google'), (req, res) => {
    res.redirect("/profile/me");
  });

  router.get('/facebook/callback',  passport.authenticate('facebook'), (req, res) => {
    res.redirect("/profile/me");
  });

  router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      res.redirect('/');
    })
  });


  return router;
}

