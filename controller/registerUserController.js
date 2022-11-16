const bcrypt = require('bcrypt');
const joi = require('joi');
const Jwt = require('jsonwebtoken');
const db = require('../model/db');
const { config } = require('../config/config');

const registerUserController = async (req, res) => {
  const {
    email, firstName, lastName, mobileNumber, address,
  } = req.body;
  const pword = req.body.password;

  const schema = joi.object({
    email: joi.string().email().required(),
    pword: joi.string().required(),
    lastName: joi.string().required(),
    firstName: joi.string().required(),
    mobileNumber: joi.number().required(),
    address: joi.string().required(),

  });
  const validation = schema.validate({
    email, pword, lastName, firstName, mobileNumber, address,
  });
  if (validation.error) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: 'Error Encountered',
    });
  }

  /**
   *
   * @param {string} pwrd password of the user
   * @returns {string}
   */
  const generateHash = (pwrd) => bcrypt.hashSync(pwrd, bcrypt.genSaltSync(8), null);

  try {
    const checkEmail = await db('users').where('email', email);
    if (checkEmail[0]) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Email Already Taken',
      });
    }
    const checkNumber = await db('users').where('phone_number', mobileNumber);
    if (checkNumber[0]) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Phone Number Already Taken',
      });
    }
    const userPassword = generateHash(pword);
    const data = {
      email,
      password: userPassword,
      is_blocked: 0,
      first_name: firstName,
      last_name: lastName,
      phone_number: mobileNumber,
    };
    const createUser = await db('users').insert(data);
    if (!createUser) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Error Creating User',
      });
    }
    const metaData = {
      user_id: createUser[0],
      meta_key: 'address',
      meta_value: address,
    };
    const createMeta = await db('user_meta').insert(metaData);
    if (!createMeta) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Error Creating Account',
      });
    }
    const accountData = {
      balance: 0,
      wallet: mobileNumber,
      user_id: createUser[0],
    };
    const createAccount = await db('accounts').insert(accountData);
    if (!createAccount) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Error Creating Account',
      });
    }
    const token = Jwt.sign({ userId: accountData.user_id }, config.jwt.ACCESS_TOKEN_SECRET, {
      expiresIn: '7d',
    });
    res.type('application/json');
    return res.status(201).json({
      success: true,
      token,
      msg: 'User account created',

    });
  } catch (err) {
    throw Error('Error Encountered');
  }
};

module.exports = registerUserController;
