const bcrypt = require('bcrypt');
const joi = require('joi');
const Jwt = require('jsonwebtoken');
const db = require('../model/db');
const { config } = require('../config/config');

const loginController = async (req, res) => {
  const {
    email, userPassword,
  } = req.body;

  const schema = joi.object({
    email: joi.string().email().required(),
    userPassword: joi.string().required(),
  });
  const validation = schema.validate({
    email, userPassword,
  });
  if (validation.error) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: 'Invalid credentials',
    });
  }
  const isValidPassword = (userPass, mpassword) => bcrypt.compareSync(mpassword, userPass);
  try {
    const checkUser = await db('users').where('email', email);
    if (!checkUser[0]) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Invalid credentials',
      });
    }
    if (checkUser[0].is_blocked) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'User blocked from accessing resources',
      });
    }
    if (!isValidPassword(checkUser[0].password, userPassword)) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Invalid credentials',
      });
    }

    if (isValidPassword(checkUser[0].password, userPassword)) {
      const uid = checkUser[0].user_id;

      const metaKey = 'address';

      const metaOutput = await db('user_meta').where('meta_key', metaKey);

      const accountLookUp = await db('accounts').where('user_id', uid);
      const token = Jwt.sign(
        { userId: uid, accountId: accountLookUp[0].account_id },
        config.jwt.ACCESS_TOKEN_SECRET,

        {
          expiresIn: '7d',
        },
      );

      const toReturn = {
        success: true,
        msg: 'Login successful',
        email: checkUser[0].email,
        isBlocked: checkUser[0].is_blocked,
        firstName: checkUser[0].first_name,
        lastName: checkUser[0].last_name,
        phoneNumber: checkUser[0].phone_number,
        accountNumber: checkUser[0].phone_number,
        address: metaOutput[0].meta_value,
        token,
      };

      res.type('application/json');
      return res.status(200).json(toReturn);
    }
    return res.status(200).json({
      success: false,
      msg: 'Error encountered',
    });
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      success: false,
      msg: 'Internal server error',
    });
  }
};

module.exports = loginController;
