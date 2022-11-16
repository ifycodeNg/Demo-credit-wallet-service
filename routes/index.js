const express = require('express');
const { config } = require('../config/config');

const router = express.Router();
const Jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[1];

    Jwt.verify(bearerToken, config.jwt.ACCESS_TOKEN_SECRET, (err, decoded) => {
      console.log(decoded);
      if (err) {
        res.sendStatus(403);
      }

      if (decoded) {
        req.token = bearerToken;
        next();
      }
    });
  } else {
    // forbidden

    res.sendStatus(403);
  }
};

const registerController = require('../controller/registerUserController');
/* POST Registeration. */
router.post('/register', registerController);

module.exports = router;
