'use strict';
const jwt = require('jsonwebtoken')
const SECRET = process.env.SECRET || 'mysecret';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const base64= require('base-64')
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Adds a virtual field to the schema. We can see it, but it never persists
// So, on every user object ... this.token is now readable!
users.virtual('token').get(function () {
  let tokenObject = {
    username: this.username,
  }
  return jwt.sign(tokenObject,SECRET,{expiresIn:60*15})
});

users.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

// BASIC AUTH
users.statics.authenticateBasic = async function (username, password) {
  const user = await this.findOne({ username }) //find recored for this username
  const valid = await bcrypt.compare(password, user.password) //compare pass with hashing pass from db 
  if (valid) { return user; } 
  throw new Error('Invalid User');
}

// BEARER AUTH
users.statics.authenticateWithToken = async function (token) {
  try {
    const parsedToken = jwt.verify(token,SECRET); //return plyload have uniq data
    const user= await this.findOne({ username: parsedToken.username }) //find recored for this uniq data
    if (user) { return user; }
    throw new Error("User Not Found");
  } catch (e) {
    throw new Error(e.message)
  }
}

module.exports = mongoose.model('users', users);
