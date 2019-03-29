const express = require('express');
const mongoose = require('mongoose');
const User = mongoose.model('user');
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
    router.get('/', (req, res) => {
      res.send(passport);
    })

    router.post("/signup", argsCheck('email', 'password'), async (req, res) => {
    const user = req.body;
    const emailCheck = await emailExists(user.email);

    if(emailCheck){
      res.sendStatus(409);
      return;
    }

    const safePass = await bcrypt.hash(user.password, 10)

    new User({
      email: user.email,
      password: safePass,
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

  router.get('/login/google', 
    passport.authenticate('google', { scope: ['profile', 'email'] }, (req, res) => {
    
    }));

  router.get('/login/facebook',  
    passport.authenticate('facebook', { scope: ['email'] }, (req, res) => {
      res.send("a");
    }));

  router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }), (req, res) => {

  });

  return router;
}

