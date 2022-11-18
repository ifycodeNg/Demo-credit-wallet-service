const joi = require('joi');
const db = require('../model/db');
const transferService = require('../services/transferService');

const withDrawalController = async (req, res) => {
  const { accountId } = req.token;
  const {
    amount, accountNumber, narration, accountBank,
  } = req.body;
  const schema = joi.object({
    amount: joi.number().min(1).required(),
    accountNumber: joi.number().min(10).required(),
    narration: joi.string().required(),
    accountBank: joi.number().min(1).required(),
  });
  const validation = schema.validate({
    amount, accountNumber, narration, accountBank,
  });
  if (validation.error) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: validation.error.details[0].message,
    });
  }
  const trx = await db.transaction();
  try {
    const getAccount = await db('accounts').where('account_id', accountId);
    if (Number(getAccount[0].balance) <= amount) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Insufficient Funds',
      });
    }
    const withdrawalRequest = await transferService.withdrawal({
      accountBank, accountNumber, amount, narration, trx, accountId,
    });
    if (withdrawalRequest.success) {
      await trx.commit();
      res.type('application/json');
      return res.status(201).json({
        success: true,
        msg: 'Withdrawal successful',
      });
    }

    if (!withdrawalRequest.success) {
      await trx.rollback();
      res.type('application/json');
      return res.status(200).json({
        success: true,
        msg: 'Withdrawal unsuccessful',
      });
    }
    res.type('application/json');
    return res.status(200).json({
      success: true,
      msg: 'Error occured',
    });
  } catch (error) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: 'Error Encountered',
    });
  }
};

module.exports = withDrawalController;
