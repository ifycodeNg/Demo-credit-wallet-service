const joi = require('joi');
const db = require('../model/db');

const rePaymentController = async (req, res) => {
  const { accountId } = req.token;
  const {
    amount,
  } = req.body;
  const schema = joi.object({
    amount: joi.number().min(1).required(),
  });
  const validation = schema.validate({
    amount,
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
    const getLoanAccount = await db('loans').where('account_id', accountId);
    await trx('loans').insert({
      amount,
      account_id: accountId,
      balance_after:
      Number(getLoanAccount[getLoanAccount.length - 1].balance_after) - Number(amount),
      balance_before: getLoanAccount[getLoanAccount.length - 1].balance_after,
      transaction_type: 'repayment',
    });
    await db('accounts').transacting(trx).where('account_id', '=', accountId).decrement({ balance: amount });
    if (!trx.isCompleted()) {
      await trx.commit();
    }
    res.type('application/json');
    return res.status(201).json({
      success: true,
      msg: 'Payment Completed',
    });
  } catch (err) {
    res.type('application/json');
    return res.status(201).json({
      success: true,
      msg: 'Error while processing payment',
    });
  }
};

module.exports = rePaymentController;
