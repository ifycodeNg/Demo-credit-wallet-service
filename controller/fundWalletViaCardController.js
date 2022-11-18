const joi = require('joi');
const db = require('../model/db');
const { chargeCard, validateTransaction } = require('../services/transferService');

const fundWalletViaCardController = async (req, res) => {
  const { userId } = req.token;
  const {
    cardNumber,
    cvv,
    expiryMonth,
    expiryYear,
    amount,
    pin,
  } = req.body;
  const schema = joi.object({
    amount: joi.number().min(1).required(),
    cvv: joi.number().min(3).required(),
    cardNumber: joi.number().min(1).required(),
    expiryMonth: joi.number().min(1).required(),
    expiryYear: joi.number().min(1).required(),
    pin: joi.number().min(4).required(),
  });
  const validation = schema.validate({
    amount,
    cvv,
    pin,
    cardNumber,
    expiryMonth,
    expiryYear,
  });
  if (validation.error) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: validation.error.details[0].message,
    });
  }
  try {
    const currency = 'NGN';
    const getUser = await db('users').where('user_id', userId);
    const {
      email, phone_number: phoneNumber, first_name: firstName, last_name: lastName,
    } = getUser[0];
    const chargeCardRequest = await chargeCard({
      cardNumber, cvv, expiryMonth, fullName: firstName.concat(' ', lastName), expiryYear, currency, amount, email, phoneNumber, pin,
    });
    if (chargeCardRequest.success) {
      req.session.flwRef = chargeCardRequest.reCallCharge.data.flw_ref;
      return res.status(201).json({
        success: true,
        msg: chargeCardRequest.reCallCharge.data.processor_response,

      });
    }
    if (chargeCardRequest.error) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Error encountered while processing card please try again',
      });
    }
  } catch (err) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: 'Error encountered while processing card please try again',
    });
  }
  res.type('application/json');
  return res.status(200).json({
    success: false,
    msg: 'Error encountered ',
  });
};

const validateCardTransfer = async (req, res) => {
  const { userId } = req.token;
  const {
    otp,
  } = req.body;
  const schema = joi.object({
    otp: joi.number().min(1).required(),
  });
  const validation = schema.validate({
    otp,
  });
  if (validation.error) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: 'Error Encountered',
    });
  }
  try {
    const trx = await db.transaction();
    const validateCard = await validateTransaction({
      otp, flwRef: req.session.flwRef, userId, trx,
    });
    if (validateCard.success) {
      await trx.commit();
      return res.status(201).json({
        success: true,
        msg: 'Payment made successfully',
      });
    }
    if (!validateCard.success) {
      await trx.rollback();
      return res.status(200).json({
        success: false,
        msg: validateCard.error,
      });
    }
  } catch (err) {
    Error('Error Encountered');
    return res.status(200).json({
      success: true,
      msg: 'Error while processing OTP Please try again',
    });
  }
  res.type('application/json');
  return res.status(200).json({
    success: false,
    msg: 'Error encountered ',
  });
};
module.exports = { fundWalletViaCardController, validateCardTransfer };
