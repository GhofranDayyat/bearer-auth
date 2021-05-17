'use strict';

const users = require('../models/users.js')
const jwt = require('jsonwebtoken')
const base64 = require('base-64')
module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { next('Invalid Login') }
    const bear = req.headers.authorization.split(' ').pop();
    let [users, pass] = base64.decode(bear).split(':');
    // let testToken= await jwt.sign(base64.encode(token),SECRET)
    console.log(users, pass);
    let tokenObject={
      username:users,
      passwoard:pass
    }
    let sendToken= jwt.sign(tokenObject,SECRET)
    const user = await users.authenticateWithToken(sendToken);
    req.user = user;
    req.token = user.token;
    if (user) {
      req.user = user;
      next();
  } else {
      next('Invalid Token!!!!');
  }
  } catch (e) {
    res.status(403).send('Invalid Login!!!!!');;
  }
}
