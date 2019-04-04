const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Profile = mongoose.model('profile');
const User = mongoose.model('user');
const argsCheck = require('../middlewares/argsCheck');
const authGuard = require('../middlewares/authGuard');
const fs = require('fs');
const shortId = require('shortid');
const s3 = require('aws-sdk');

module.exports = passport => {
  router.get('/me', authGuard(), async (req, res) => {
    const userId = req.session.passport.user;

    if(!userId) {
      res.sendStatus(401);
      return;
    }

    const user = await User.findOne({ _id: userId });

    if(user) {
      const profile = await Profile.findOne({ _id: user.profileId });

      if(profile) {
        res.send(profile);
        return;
      }

      res.status(404).send("No profile found");
      return;
    }

    res.status(404).send("User not Found"); 
  });

  router.post('/change/display-name', authGuard(), argsCheck('newName'), async (req, res) => {
    const newName = req.body.newName;

    const nameCheck = await Profile.findOne({ displayName: newName });
    if(nameCheck) {
      res.sendStatus(401);
      return;
    }

    const userId = req.session.passport.user;
    const user = await User.findOne({ _id: userId });

    if(!user) {
      res.sendStatus(404);
    } 

    Profile.updateOne({ _id: profileId }, {
      displayName: newName
    })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.send(err);
    });

  });

  router.post('/change/intro', authGuard(), argsCheck('intro'), async (req, res) => {
    const userId = req.session.passport.user;
    const user = await User.findOne({ _id: userId });

    if(!user) {
      res.sendStatus(404);
    } 

    Profile.updateOne({ _id: profileId }, {
      intro: req.body.intro
    })
    .then(user => {
      res.send(user);
    })
    .catch(err => {
      res.send(err);
    });

  });

  router.post('/change/image', async (req, res) => {
    const dataURL = req.body.data;
    
    const typeCheck = (/(jpg)|(jpeg)|(png)/).exec(dataURL);

    let type;
    if(typeCheck) {
      type = typeCheck[0];
    } else {
      res.sendStatus(400);
      return;
    }

    const base64 = (dataURL + "").replace(/^data:image\/(png|jpg|jpeg);base64,/, "");

    //fs.writeFileSync(shortId.generate() + "." + type, base64, { encoding: 'base64' });



    res.sendStatus(200);
  });
  
  return router;
}