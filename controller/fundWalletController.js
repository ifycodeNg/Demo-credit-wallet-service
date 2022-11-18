const joi = require('joi');
const db = require('../model/db');

const fundWalletController = async (req, res) => {
  const { accountId } = req.token;
  const {
    loanAmount,
  } = req.body;
  const schema = joi.object({
    loanAmount: joi.number().min(1).required(),
  });
  const validation = schema.validate({
    loanAmount,
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
    if (!getLoanAccount[0]) {
      await db('loans').insert({
        amount: loanAmount,
        account_id: accountId,
        balance_after: loanAmount,
        balance_before: 0,
        transaction_type: 'loan',
      });
      await db('accounts').transacting(trx).where('account_id', '=', accountId).increment({ balance: loanAmount });
      res.type('application/json');
      return res.status(201).json({
        success: true,
        msg: 'Loan granted successfully',
      });
    }
    await db('loans').insert({
      amount: loanAmount,
      account_id: accountId,
      balance_after:
      Number(loanAmount) + Number(getLoanAccount[getLoanAccount.length - 1].balance_after),
      balance_before: getLoanAccount[getLoanAccount.length - 1].balance_after,
      transaction_type: 'loan',
    });
    await db('accounts').transacting(trx).where('account_id', '=', accountId).increment({ balance: loanAmount });
    if (!trx.isCompleted()) {
      await trx.commit();
    }
    res.type('application/json');
    return res.status(201).json({
      success: true,
      msg: 'Loan granted successfully',
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      msg: 'Error Encountered',
    });
  }
};
module.exports = fundWalletController;
