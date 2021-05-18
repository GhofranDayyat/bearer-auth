'use strict';

const users = require('../models/users.js')

module.exports = async (req, res, next) => {

  try {

    if (!req.headers.authorization) { next('Invalid Login') } 
    console.log(req.headers.authorization); //'Bearer token'
    const token = req.headers.authorization.split(' ').pop();
    const validUser = await users.authenticateWithToken(token); //this method return recored
    req.user = validUser; 
    req.token = validUser.token;

    next();
  } catch (e) {
    res.status(403).send('Invalid Login');;
  }
}