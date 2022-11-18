const db = require('../model/db');

const getLoanBalanceController = async (req, res) => {
  try {
    const { accountId } = req.token;
    const trx = await db.transaction();
    const loanAccountLookUp = await db('loans').transacting(trx).where({ account_id: accountId, transaction_type: 'loan' });
    trx.commit();
    if (loanAccountLookUp.length < 1) {
      res.type('application/json');
      return res.status(200).json({
        success: true,
        Loanbalance: 0.00,
      });
    }
    const { balance_after: Loanbalance } = loanAccountLookUp[loanAccountLookUp.length - 1];

    res.type('application/json');
    return res.status(200).json({
      success: true,
      Loanbalance,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      msg: 'Internal server error',
    });
  }
};

module.exports = getLoanBalanceController;
