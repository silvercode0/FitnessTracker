/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();

const { 
    createUser,
    getUser,
    getUserById,
    getUserByUsername,
} = require("../db")

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

// POST /api/users/register
router.post('/users/register', async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const _user = await getUserByUsername(username);
  
      if (_user) {
        next({
          name: 'UserExistsError',
          message: 'A user by that username already exists'
        });
      }
  
      const user = await createUser({
        username,
        password,
        name,
        location,
      });
  
      const token = jwt.sign({
        id: user.id,
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '1w'
      });
  
      res.send({
        message: "thank you for signing up",
        token
      });
    } catch ({ name, message }) {
      next({ name, message })
    }
  });
// POST /api/users/login
router.post('/users/login', async (req, res, next) => {
    const { username, password } = req.body;
  
  
    // request must have both
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
      const id = user.id
      console.log('user.id =', id);
  
      if (user && user.password == password) {
        const token = jwt.sign({ id: id, username: username }, JWT_SECRET)
        token;
        res.send({ token: token });
      } else {
        next({
          name: 'IncorrectCredentialsError',
          message: 'Username or password is incorrect'
        });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  });

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;