const db = require('../model/db');

const getAccountBalanceController = async (req, res) => {
  try {
    const { accountId } = req.token;
    const trx = await db.transaction();
    const accountLookUp = await db('accounts').transacting(trx).where('account_id', accountId);
    trx.commit();
    const { balance } = accountLookUp[0];
    res.type('application/json');
    return res.status(200).json({
      success: true,
      accountBalance: balance,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      msg: 'Internal server error',
    });
  }
};

module.exports = getAccountBalanceController;
