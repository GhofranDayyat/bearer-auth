'use strict';
const jwt = require('jsonwebtoken');
const SECRET = process.env.SECRET || 'mysecret';
const base64 = require('base-64');
const User = require('../models/users.js');

module.exports = async (req, res, next) => {

  if (!req.headers.authorization) { return next('error') }
  let basic = req.headers.authorization.split(' ').pop() ; //'Basic decode(user:password)'
  let [user, pass] = base64.decode(basic).split(':');
  console.log(user, pass);
  try { 

    req.user= await User.authenticateBasic(user, pass)//pass 2 Arrq decoded to this method ==>then return userrecored if passwored match ?stor recored in property called user then create token 
    let token = jwt.sign({username: user.username}, SECRET); //create token different each time sign in (uniq data,secret) then next
    next();
  } catch (e) {
    res.status(403).send('Invalid Login');
  }

}

