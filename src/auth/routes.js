'use strict';
const express = require('express');
const authRouter = express.Router();

const User = require('./models/users.js');
const basicAuth = require('./middleware/basic.js')
const bearerAuth = require('./middleware/bearer.js')



authRouter.post('/signup', async (req, res, next) => {
  try {
    let user = new User(req.body);
    const userRecord = await user.save();
    const output = {
      user: {
        id:userRecord.id,
        username:userRecord.username,
      },
      token:userRecord.token
    };
    console.log('output===>');
    res.status(201).json(output);
  } catch (e) {
    next(e.message)
  }
});

authRouter.post('/signin', basicAuth, (req, res, next) => {
  const user = {
    user: req.user,
    token: req.user.token //store token you have now in req obj and you can send it anywheare 
  };
  res.cookie('cookie-token', user.token);
  res.set('cookie-token', user.token);
  res.status(200).json(user);

});
;
authRouter.get('/users', bearerAuth, async (req, res, next) => { //this rout is protected , you can't access unless you have token 
  const users = await User.find({}); //find all users in DB 
  const list = users.map(user => user.username);
  res.status(200).json(list);
});

authRouter.get('/secret', bearerAuth, async (req, res, next) => {
  res.status(200).send("Welcome to the secret area!")
});


module.exports = authRouter;
