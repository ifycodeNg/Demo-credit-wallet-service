const joi = require('joi');
const { v4 } = require('uuid');
const db = require('../model/db');
const transferService = require('../services/transferService');

const transferFundsController = async (req, res) => {
  const { userId, accountId } = req.token;
  const reference = v4();
  const {
    amount,
    accountNumber,
  } = req.body;
  const schema = joi.object({
    amount: joi.number().min(1).required(),
    accountNumber: joi.number().min(11).required(),
  });
  const validation = schema.validate({
    accountNumber, amount,
  });
  if (validation.error) {
    res.type('application/json');
    return res.status(200).json({
      success: false,
      msg: 'Error Encountered',
    });
  }
  try {
    const getRecipentAccount = await db('accounts').where('wallet', accountNumber);
    const getSenderAccount = await db('accounts').where('user_id', userId);

    if (!getRecipentAccount[0]) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Account does not exist',
      });
    }
    if (Number(getSenderAccount[0].balance) < amount) {
      res.type('application/json');
      return res.status(200).json({
        success: false,
        msg: 'Insufficient Funds',
      });
    }
    const trx = await db.transaction();
    const transferResult = await Promise.all([
      transferService.debitAccount({
        amount,
        accountId,
        purpose: 'transfer',
        reference,
        trx,
      }),
      transferService.creditAccount({
        amount,
        accountId: getRecipentAccount[0].account_id,
        purpose: 'transfer',
        reference,
        trx,
      }),
    ]);

    const failedTxns = transferResult.filter((result) => !result.success);
    if (failedTxns.length) {
      await trx.rollback();
      return transferResult;
    }

    await trx.commit();
    res.type('application/json');
    return res.status(201).json({
      success: true,
      msg: 'Transfer Successful',
    });
  } catch (err) {
    Error('Error Encountered');
    res.type('application/json');
    return res.status(201).json({
      success: false,
      msg: 'Error encountered',
    });
  }
};

module.exports = transferFundsController;
